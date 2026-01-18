import { getDB } from '../db';
import { MIGRATIONS } from '../db/schema';

export const initDatabase = async () => {
    const db = await getDB();

    // DEVELOPMENT ONLY: Drop tables to force schema update due to refactor
    // In production, use PRAGMA user_version for migrations
    await db.runAsync('DROP TABLE IF EXISTS jobs');
    await db.runAsync('DROP TABLE IF EXISTS notes');
    // await db.runAsync('DROP TABLE IF EXISTS sync_queue'); // Optional: keep queue? Better to reset all for consistency.
    await db.runAsync('DROP TABLE IF EXISTS sync_queue');

    for (const query of MIGRATIONS) {
        await db.runAsync(query);
    }
    console.log('Database initialized and reset successfully');
};
