import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDB = async () => {
    if (!dbInstance) {
        dbInstance = await SQLite.openDatabaseAsync('jobapp.db');
    }
    return dbInstance;
};

// Helper for executing write transactions
export const runTransaction = async (callback: (db: SQLite.SQLiteDatabase) => Promise<void>) => {
    const db = await getDB();
    await db.withTransactionAsync(async () => {
        await callback(db);
    });
};
