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
    }
};
