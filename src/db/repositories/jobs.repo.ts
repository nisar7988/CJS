import { getDB } from '../index';
import { Job } from '../../types/models';
import { generateUUID } from '../../utils/uuid';
import { SyncQueueRepo } from './syncQueue.repo';

export const JobsRepo = {
    getAll: async (): Promise<Job[]> => {
        const db = await getDB();
        return await db.getAllAsync<Job>('SELECT * FROM jobs ORDER BY created_at DESC');
    },

    getById: async (id: string): Promise<Job | null> => {
        const db = await getDB();
        const result = await db.getFirstAsync<Job>('SELECT * FROM jobs WHERE id = ?', [id]);
        return result || null;
    },

    create: async (job: Omit<Job, 'id' | 'server_id' | 'created_at' | 'updated_at' | 'synced'>) => {
        const db = await getDB();
        const id = generateUUID();
        const now = Date.now();

        await db.runAsync(
            `INSERT INTO jobs (id, title, location, budget, description, created_at, updated_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
            [id, job.title, job.location, job.budget, job.description || '', now, now]
        );

        // Add to sync queue
        await SyncQueueRepo.add('CREATE_JOB', { id, ...job, created_at: now, updated_at: now });

        return id;
    },

    update: async (id: string, updates: Partial<Omit<Job, 'id' | 'created_at' | 'updated_at' | 'synced'>>) => {
        const db = await getDB();
        const now = Date.now();

        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        if (!fields) return;

        const values = Object.values(updates);

        await db.runAsync(
            `UPDATE jobs SET ${fields}, updated_at = ?, synced = 0 WHERE id = ?`,
            [...values, now, id]
        );

        // Add to sync queue
        await SyncQueueRepo.add('UPDATE_JOB', { id, ...updates, updated_at: now });
    },

    delete: async (id: string) => {
        const db = await getDB();
        await db.runAsync('DELETE FROM jobs WHERE id = ?', [id]);

        // Add to sync queue
        await SyncQueueRepo.add('DELETE_JOB', { id });
    },

    markSynced: async (id: string) => {
        const db = await getDB();
        await db.runAsync('UPDATE jobs SET synced = 1 WHERE id = ?', [id]);
    },

    setServerId: async (localId: string, serverId: string) => {
        const db = await getDB();
        await db.runAsync('UPDATE jobs SET server_id = ?, synced = 1 WHERE id = ?', [serverId, localId]);
    },

    syncFromServer: async (apiJobs: any[]) => {
        const db = await getDB();

        if (!Array.isArray(apiJobs)) return;

        for (const job of apiJobs) {
            // job.clientJobId is the local ID we generated
            // job._id is the server ID

            const localId = job.clientJobId || job._id;

            // Check if we have this job locally
            const existing = await db.getFirstAsync<Job>('SELECT * FROM jobs WHERE id = ?', [localId]);

            if (existing) {
                // Determine if we should overwrite
                // If local is NOT synced (synced=0), we have pending changes. Priority: Local (Keep pending).
                if (existing.synced === 1) {
                    await db.runAsync(
                        `UPDATE jobs SET 
                        server_id = ?, 
                        title = ?, 
                        location = ?, 
                        budget = ?, 
                        description = ?, 
                        updated_at = ?, 
                        synced = 1 
                        WHERE id = ?`,
                        [job._id, job.title, job.location, job.budget, job.description, new Date(job.updatedAt).getTime(), localId]
                    );
                } else {
                    // We have pending changes. 
                    // We SHOULD update the server_id mapping though
                    if (!existing.server_id && job._id) {
                        await db.runAsync('UPDATE jobs SET server_id = ? WHERE id = ?', [job._id, localId]);
                    }
                }
            } else {
                // New job from server, insert it
                await db.runAsync(
                    `INSERT INTO jobs (id, server_id, title, location, budget, description, created_at, updated_at, synced, user_id)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
                    [localId, job._id, job.title, job.location, job.budget, job.description, new Date(job.createdAt).getTime(), new Date(job.updatedAt).getTime(), job.userId]
                );
            }
        }
    }
};
