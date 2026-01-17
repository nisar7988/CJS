import { getDB } from '../db';
import { MIGRATIONS } from '../db/schema';

export const initDatabase = async () => {
    const db = await getDB();
    for (const query of MIGRATIONS) {
        await db.runAsync(query);
    }
    console.log('Database initialized successfully');
};
