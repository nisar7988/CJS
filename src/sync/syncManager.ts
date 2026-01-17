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
            await JobsApi.create(payload);
            await JobsRepo.markSynced(payload.id);
            break;

        case 'UPDATE_JOB':
            await JobsApi.update(payload.id, payload);
            // Implicitly synced by removal from queue, but we could update flag if we wanted
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
            await NotesApi.create(payload);
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

export const SyncManager = {
    processQueue: async () => {
        if (isSyncing || !useNetworkStore.getState().isOnline) return;

        isSyncing = true;
        console.log('Starting sync process...');

        try {
            // Get all items. We might want to prioritize JOBS over NOTES if they are mixed.
            // But simple FIFO usually works if we assume Job creation happens before Note creation in the queue.
            // If they are independent, we can filter.
            const items = await SyncQueueRepo.getAll();

            // Filter specific lists if we want to enforce order (Jobs first)
            const jobItems = items.filter(i => i.action.includes('JOB'));
            const noteItems = items.filter(i => i.action.includes('NOTE'));
            const sortedItems = [...jobItems, ...noteItems];
            // Note: This re-ordering might be risky if a Note Update depends on a Job Update that came later?
            // Actually, usually Job exists -> Note created. 
            // If we just stick to FIFO (created_at), it should be safest for dependency.
            // But the user requirements said: "Sync pending Jobs first. Sync Notes after".
            // So let's stick to that requirement.

            for (const item of sortedItems) {
                try {
                    await retryPolicy(async () => {
                        if (item.action.includes('JOB')) {
                            await syncJobs(item);
                        } else if (item.action.includes('NOTE')) {
                            await syncNotes(item);
                        }
                    });

                    // Remove from queue on success
                    if (item.id) {
                        await SyncQueueRepo.remove(item.id);
                    }

                } catch (error) {
                    console.error(`Failed to sync item ${item.id} (${item.action}):`, error);
                    // "One note fails -> others still sync"
                    // We continue to the next item
                }
            }
        } catch (e) {
            console.error('Sync process error:', e);
        } finally {
            isSyncing = false;
        }
    }
};
