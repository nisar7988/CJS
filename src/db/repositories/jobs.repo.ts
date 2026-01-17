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

    create: async (job: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'synced'>) => {
        const db = await getDB();
        const id = generateUUID();
        const now = Date.now();

        await db.runAsync(
            `INSERT INTO jobs (id, title, company, status, salary, description, created_at, updated_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
            [id, job.title, job.company, job.status, job.salary || '', job.description || '', now, now]
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
    }
};
