import { useNetworkStore } from '../store/network.store';
import { SyncQueueRepo } from '../db/repositories/syncQueue.repo';
import { JobsApi } from '../api/jobs.api';
import { JobsRepo } from '../db/repositories/jobs.repo';
import { NotesApi } from '../api/notes.api';
import { NotesRepo } from '../db/repositories/notes.repo';
import { SyncItem } from '../types/models';

let isSyncing = false;

// Retry policy helper
const retryPolicy = async (fn: () => Promise<any>, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(res => setTimeout(res, delay));
        }
    }
};

// Job Sync Logic
const syncJobs = async (item: SyncItem) => {
    const payload = JSON.parse(item.payload);

    switch (item.action) {
        case 'CREATE_JOB':
            const createJobPayload = {
                clientJobId: payload.id,
                title: payload.title,
                location: payload.location || 'Remote',
                description: payload.description || '',
                budget: Number(payload.budget) || 0,
            };
            const response = await JobsApi.create(createJobPayload);
            const createdJob = response.data as any; // Cast to allow accessing _id from backend response
            if (createdJob && createdJob._id) {
                await JobsRepo.setServerId(payload.id, createdJob._id);
            } else {
                await JobsRepo.markSynced(payload.id);
            }
            break;

        case 'UPDATE_JOB':
            const updateJobPayload = {
                clientJobId: payload.id,
                title: payload.title,
                location: payload.location || 'Remote',
                description: payload.description || '',
                budget: Number(payload.budget) || 0,
            };
            await JobsApi.update(payload.id, updateJobPayload);
            break;

        case 'DELETE_JOB':
            await JobsApi.delete(payload.id);
            break;
    }
};

// Note Sync Logic
const syncNotes = async (item: SyncItem) => {
    const payload = JSON.parse(item.payload);

    switch (item.action) {
        case 'CREATE_NOTE':
            const createNotePayload = {
                clientNoteId: payload.id,
                text: payload.content,
            };

            // Resolve Job ID: Prefer Server ID if available
            const job = await JobsRepo.getById(payload.job_id);
            const targetJobId = job?.server_id || payload.job_id;

            // jobId is passed in URL
            await NotesApi.create(targetJobId, createNotePayload);
            await NotesRepo.markSynced(payload.id);
            break;

        case 'UPDATE_NOTE':
            await NotesApi.update(payload.job_id, payload.id, payload.content);
            break;

        case 'DELETE_NOTE':
            await NotesApi.delete(payload.job_id, payload.id);
            break;
    }
};

// Video Sync Logic
import { VideosRepo } from '../db/repositories/videos.repo';

const syncVideos = async (item: SyncItem) => {
    console.log('[SyncManager] Processing VIDEO_UPLOAD item:', item.id);
    const payload = JSON.parse(item.payload);
    const { clientVideoId, jobId } = payload;

    const video = await VideosRepo.getById(clientVideoId);
    if (!video) {
        console.log('[SyncManager] Video not found in DB, removing from queue:', clientVideoId);
        if (item.id) await SyncQueueRepo.remove(item.id);
        return;
    }

    console.log(`[SyncManager] Video ${clientVideoId} status: ${video.status}, retry: ${video.retry_count}`);

    if (video.status === 'UPLOADED') {
        console.log('[SyncManager] Video already uploaded, removing from queue.');
        if (item.id) await SyncQueueRepo.remove(item.id);
        return;
    }

    if (video.retry_count >= 3) {
        console.log('[SyncManager] Max retries reached for video.');
        await VideosRepo.updateStatus(clientVideoId, 'FAILED', "Max retries reached");
        if (item.id) await SyncQueueRepo.remove(item.id);
        return;
    }

    // Resolve Job ID
    const job = await JobsRepo.getById(jobId);
    if (!job || !job.server_id) {
        console.log(`[SyncManager] Skipping video ${clientVideoId} - Job ${jobId} has no server_id (Local Job ID?)`);
        return;
    }

    console.log(`[SyncManager] Starting upload for video ${clientVideoId} to Job Server ID: ${job.server_id}`);

    try {
        await VideosRepo.updateStatus(clientVideoId, 'UPLOADING');

        const file = {
            uri: video.file_uri,
            name: `video_${clientVideoId}.mp4`,
            type: 'video/mp4',
        };

        const response = await JobsApi.addSiteVideo(job.server_id, {
            image: file,
            clientVideoId: clientVideoId
        });

        console.log('[SyncManager] Upload success:', response.status);

        // Success
        await VideosRepo.updateStatus(clientVideoId, 'UPLOADED');
        if (item.id) await SyncQueueRepo.remove(item.id);

    } catch (error: any) {
        console.error(`Video upload failed for ${clientVideoId}`, error);
        await VideosRepo.incrementRetry(clientVideoId);
        await VideosRepo.updateStatus(clientVideoId, 'FAILED', error.message || "Upload Failed");
        // We throw so the main loop catches it, but we already handled the retry logic in DB.
        // Actually, we should NOT throw if we want to continue processing others?
        // But the main loop catches specific item errors and continues. 
        // So throwing is fine for logging, but we manually handled the queue state above.
    }
};

export const SyncManager = {
    pullUpdates: async () => {
        try {
            // Fetch Jobs
            const response = await JobsApi.getAll();
            if (response.data) {
                const data = Array.isArray(response.data) ? response.data : (response.data as any).data || [];

                if (Array.isArray(data)) {
                    await JobsRepo.syncFromServer(data);
                }
            }
        } catch (e) {
            console.error('Pull Sync failed', e);
        }
    },

    processQueue: async () => {
        if (isSyncing || !useNetworkStore.getState().isOnline) return;

        isSyncing = true;
        console.log('Starting sync process...');

        try {
            // 1. Push Changes
            const items = await SyncQueueRepo.getAll();
            // Prioritize Jobs?
            // User requirement: "Sync must be safe... each pending item has its own status"
            // We use the sorted list from DB (FIFO).

            for (const item of items) {
                try {
                    await retryPolicy(async () => {
                        if (item.action.includes('JOB')) {
                            await syncJobs(item);
                        } else if (item.action.includes('NOTE')) {
                            await syncNotes(item);
                        } else if (item.action === 'VIDEO_UPLOAD') {
                            await syncVideos(item);
                        }
                    });

                    // Remove from queue on success (Video upload handles its own removal/retry logic inside syncVideos, but we need to remove here if it succeeds)
                    // For VIDEO_UPLOAD, syncVideos returns true if fully done, or we check DB status.
                    // Actually, let's keep it simple: if syncVideos throws, we catch below. If it returns, we remove.
                    // BUT for videos, we only remove if uploaded or max retries reached.

                    if (item.action !== 'VIDEO_UPLOAD') {
                        if (item.id) await SyncQueueRepo.remove(item.id);
                    } else {
                        // For video, syncVideos handles queue removal if needed (or we check status)
                        // To avoid double removal complex logic, let's make syncVideos throw if we shouldn't remove?
                        // Better: let syncVideos manage the queue item removal for itself because of the "Skip" logic.
                        // If we skip, we don't want to remove.
                        // So we should NOT remove here for VIDEO_UPLOAD.
                    }

                    if (item.action !== 'VIDEO_UPLOAD') {
                        console.log(`Synced item ${item.id} (${item.action})`);
                    }
                } catch (error) {
                    console.error(`Failed to sync item ${item.id} (${item.action}):`, error);
                    // Continue to next item
                }
            }

            // 2. Pull Updates (After pushing local changes)
            await SyncManager.pullUpdates();

        } catch (e) {
            console.error('Sync process error:', e);
        } finally {
            isSyncing = false;
        }
    }
};
