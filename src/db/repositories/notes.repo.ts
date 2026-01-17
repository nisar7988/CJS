import { getDB } from '../index';
import { Note } from '../../types/models';
import { generateUUID } from '../../utils/uuid';
import { SyncQueueRepo } from './syncQueue.repo';

export const NotesRepo = {
    getByJobId: async (jobId: string): Promise<Note[]> => {
        const db = await getDB();
        return await db.getAllAsync<Note>('SELECT * FROM notes WHERE job_id = ? ORDER BY created_at DESC', [jobId]);
    },

    getById: async (id: string): Promise<Note | null> => {
        const db = await getDB();
        const result = await db.getFirstAsync<Note>('SELECT * FROM notes WHERE id = ?', [id]);
        return result || null;
    },

    create: async (note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'synced'>) => {
        const db = await getDB();
        const id = generateUUID();
        const now = Date.now();

        await db.runAsync(
            `INSERT INTO notes (id, job_id, content, created_at, updated_at, synced)
       VALUES (?, ?, ?, ?, ?, 0)`,
            [id, note.job_id, note.content, now, now]
        );

        // Add to sync queue
        await SyncQueueRepo.add('CREATE_NOTE', { id, ...note, created_at: now, updated_at: now });

        return id;
    },

    update: async (id: string, content: string) => {
        const db = await getDB();
        const now = Date.now();

        // Get job_id for sync
        const note = await db.getFirstAsync<Note>('SELECT job_id FROM notes WHERE id = ?', [id]);
        if (!note) return; // Should probably throw error or handle consistency

        await db.runAsync(
            `UPDATE notes SET content = ?, updated_at = ?, synced = 0 WHERE id = ?`,
            [content, now, id]
        );

        // Add to sync queue
        await SyncQueueRepo.add('UPDATE_NOTE', { id, job_id: note.job_id, content, updated_at: now });
    },

    delete: async (id: string) => {
        const db = await getDB();

        // Get job_id for sync
        const note = await db.getFirstAsync<Note>('SELECT job_id FROM notes WHERE id = ?', [id]);
        if (!note) return;

        await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);

        // Add to sync queue
        await SyncQueueRepo.add('DELETE_NOTE', { id, job_id: note.job_id });
    },

    markSynced: async (id: string) => {
        const db = await getDB();
        await db.runAsync('UPDATE notes SET synced = 1 WHERE id = ?', [id]);
    }
};
