export const SQL_SCHEMA = {
    createJobsTable: `
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      status TEXT NOT NULL,
      salary TEXT,
      description TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      synced INTEGER DEFAULT 0
    );
  `,
    createNotesTable: `
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY NOT NULL,
      job_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
    );
  `,
    createSyncQueueTable: `
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL, -- 'CREATE_JOB', 'UPDATE_JOB', 'DELETE_JOB', 'CREATE_NOTE', etc.
      payload TEXT NOT NULL, -- JSON string
      created_at INTEGER NOT NULL
    );
  `
};

export const MIGRATIONS = [
    SQL_SCHEMA.createJobsTable,
    SQL_SCHEMA.createNotesTable,
    SQL_SCHEMA.createSyncQueueTable,
];
