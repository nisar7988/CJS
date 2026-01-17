import { getDB } from '../index';
import { SyncItem } from '../../types/models';

export const SyncQueueRepo = {
    add: async (action: SyncItem['action'], payload: object) => {
        const db = await getDB();
        const jsonPayload = JSON.stringify(payload);
        const createdAt = Date.now();
        await db.runAsync(
            `INSERT INTO sync_queue (action, payload, created_at) VALUES (?, ?, ?)`,
            [action, jsonPayload, createdAt]
        );
    },

    getAll: async (): Promise<SyncItem[]> => {
        const db = await getDB();
        const result = await db.getAllAsync<SyncItem>('SELECT * FROM sync_queue ORDER BY created_at ASC');
        return result;
    },

    remove: async (id: number) => {
        const db = await getDB();
        await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
    },

    clear: async () => {
        const db = await getDB();
        await db.runAsync('DELETE FROM sync_queue');
    }
};
