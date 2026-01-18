import { getDB } from '../index';
import { Video, VideoStatus } from '../../types/models';

export const VideosRepo = {
    add: async (video: Video) => {
        const db = await getDB();
        await db.runAsync(
            `INSERT INTO videos (id, job_id, file_uri, status, retry_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [video.id, video.job_id, video.file_uri, video.status, video.retry_count, video.created_at, video.updated_at]
        );
    },

    getPendingByJobId: async (jobId: string): Promise<Video[]> => {
        const db = await getDB();
        return await db.getAllAsync<Video>(
            'SELECT * FROM videos WHERE job_id = ? AND status != ? ORDER BY created_at DESC',
            [jobId, 'UPLOADED']
        );
    },

    getByJobId: async (jobId: string): Promise<Video[]> => {
        const db = await getDB();
        return await db.getAllAsync<Video>(
            'SELECT * FROM videos WHERE job_id = ? ORDER BY created_at DESC',
            [jobId]
        );
    },

    getById: async (id: string): Promise<Video | null> => {
        const db = await getDB();
        const result = await db.getAllAsync<Video>('SELECT * FROM videos WHERE id = ?', [id]);
        return result.length > 0 ? result[0] : null;
    },

    updateStatus: async (id: string, status: VideoStatus, errorMessage?: string) => {
        const db = await getDB();
        const now = Date.now();
        await db.runAsync(
            `UPDATE videos SET status = ?, error_message = ?, updated_at = ? WHERE id = ?`,
            [status, errorMessage || null, now, id]
        );
    },

    incrementRetry: async (id: string) => {
        const db = await getDB();
        const now = Date.now();
        // Increment retry count and update updated_at
        await db.runAsync(
            `UPDATE videos SET retry_count = retry_count + 1, updated_at = ? WHERE id = ?`,
            [now, id]
        );
    },

    setServerId: async (id: string, serverId: string) => {
        const db = await getDB();
        const now = Date.now();
        await db.runAsync(
            `UPDATE videos SET server_id = ?, updated_at = ? WHERE id = ?`,
            [serverId, now, id]
        );
    },

    syncFromServer: async (videoData: any, jobId: string) => {
        const db = await getDB();
        // The server response for siteVideo:
        /*
           "siteVideo": {
               "fileName": null,
               "filePath": null,
               "fileSize": null,
               "mimeType": null,
               "_id": "696ce61bbd891a0af2d09efa",
               ...
               "clientVideoId": "d71ced21-6fbc-455c-ba2b-5d4d8da91283",
               ...
           }
        */

        if (!videoData) return;

        const localId = videoData.clientVideoId || videoData._id;

        const existing = await db.getAllAsync<Video>('SELECT * FROM videos WHERE id = ?', [localId]);

        if (existing.length > 0) {
            const video = existing[0];
            // If already synced, update meta?
            // Actually, we mostly care about status. If server has it, it's UPLOADED.
            if (video.status !== 'UPLOADED') {
                await db.runAsync(
                    `UPDATE videos SET status = 'UPLOADED', server_id = ?, updated_at = ? WHERE id = ?`,
                    [videoData._id, new Date(videoData.updatedAt).getTime(), localId]
                );
            }
        } else {
            // New video from server (created by someone else?)
            // We might not have the file locally, so we can't really "play" it if it's local-only file URI logic.
            // But we should store the record.
            // If the server provides a URL (filePath?), we might be able to use it.
            // The current JSON shows `filePath: null` for some reason, maybe because it's only metadata?
            // Or maybe it's populated for other jobs.
            // Let's insert what we can.
            await db.runAsync(
                `INSERT INTO videos (id, job_id, file_uri, status, retry_count, created_at, updated_at, server_id) 
                 VALUES (?, ?, ?, 'UPLOADED', 0, ?, ?, ?)`,
                [localId, jobId, videoData.filePath || '', new Date(videoData.createdAt).getTime(), new Date(videoData.updatedAt).getTime(), videoData._id]
            );
        }
    }
};
