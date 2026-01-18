export const SQL_SCHEMA = {
  createJobsTable: `
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY NOT NULL,
      server_id TEXT,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      budget REAL NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      synced INTEGER DEFAULT 0,
      user_id TEXT
    );
  `,
  createNotesTable: `
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY NOT NULL,
      server_id TEXT,
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
      action TEXT NOT NULL, -- 'CREATE_JOB', 'UPDATE_JOB', 'DELETE_JOB', 'CREATE_NOTE', 'VIDEO_UPLOAD'
      payload TEXT NOT NULL, -- JSON string
      created_at INTEGER NOT NULL
    );
  `,
  createVideosTable: `
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY NOT NULL,
      server_id TEXT,
      job_id TEXT NOT NULL,
      file_uri TEXT NOT NULL,
      status TEXT NOT NULL, -- 'PENDING', 'UPLOADING', 'UPLOADED', 'FAILED'
      retry_count INTEGER DEFAULT 0,
      error_message TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `
};

export const MIGRATIONS = [
  SQL_SCHEMA.createJobsTable,
  SQL_SCHEMA.createNotesTable,
  SQL_SCHEMA.createSyncQueueTable,
  SQL_SCHEMA.createVideosTable,
];
