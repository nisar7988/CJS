# Synchronization Mechanism Documentation

This document details the **Offline-First Synchronization Architecture** used in the application. The system ensures that users can interact with the app seamlessly regardless of network connectivity, with changes being reliably synced to the backend when possible.

## 🏗 Architecture Overview

The application follows an **Offline-First / Local-First** approach.

1.  **Single Source of Truth (UI)**: The UI **always** reads from the local SQLite database. It never waits for a network response to update the screen.
2.  **Write Strategy**: All create/update/delete operations are committed to the local database immediately.
3.  **Sync Queue**: A separate background process handles communicating these changes to the backend API.

## 💾 Database Schema: `sync_queue`

To track changes that need to be sent to the server, we maintain a dedicated table in SQLite called `sync_queue`.

```sql
CREATE TABLE IF NOT EXISTS sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,  -- e.g., 'CREATE_JOB', 'UPDATE_NOTE'
  payload TEXT NOT NULL, -- JSON string containing the data
  created_at INTEGER NOT NULL
);
```

## 🔄 The Sync Workflow

### 1. Capturing Changes (The Producer)

When a user performs an action (e.g., creating a job), the **Repository** layer handles the transaction. It performs two atomic operations:

1.  **Update Local Entity**: Inserts or updates the actual data row (e.g., in the `jobs` table) with a flag `synced = 0`.
2.  **Enqueue Action**: Adds a record to the `sync_queue` with the necessary payload.

**Example: Creating a Job**
*(File: `src/db/repositories/jobs.repo.ts`)*

```typescript
// 1. Insert into local DB
await db.runAsync(
    `INSERT INTO jobs ...`, 
    [id, job.title, ...]
);

// 2. Add to Sync Queue
await SyncQueueRepo.add('CREATE_JOB', { id, ...job });
```

### 2. Processing the Queue (The Consumer)

The `SyncManager` (`src/sync/syncManager.ts`) is responsible for flushing the queue.

*   **Logic**: It fetches all items from `sync_queue` ordered by `created_at` (FIFO - First In, First Out) to maintain operational order.
*   **Processing**:
    1.  Checks if the device is **Online** and not already syncing.
    2.  Iterates through queue items.
    3.  Calls the appropriate API endpoint based on the `action` type.
    4.  **On Success**:
        *   Removes the item from `sync_queue`.
        *   Updates the local entity's status to `synced = 1`.
    5.  **On Failure**:
        *   Logs the error.
        *   The item remains in the queue to be retried in the next cycle.

### 3. Triggers (When do we sync?)

Synchronization is triggered automatically by the `useSyncOnNetwork` hooks (`src/hooks/useSyncOnNetwork.ts`):

1.  **Network Connection**: When the device detects it has regained internet access (`useNetworkStore`).
2.  **App Foreground**: When the app comes back to the foreground (active state).
3.  **Immediate**: Optionally, right after an action is queued (if already online).

## 🛡️ Error Handling & Retry Policy

*   **Retry Logic**: The `SyncManager` implements a simple retry policy (e.g., 3 attempts) for each network request during a sync cycle.
*   **Failures**: If an item fails to sync after retries (e.g., 500 Server Error), it stays in the queue. This prevents data loss. The system will attempt to sync it again the next time the process runs.
*   **Blockage**: Currently, if Item A fails, the loop continues to Item B (unless strict sequential dependency is enforced).

## 🧩 Key Files

| Component | File Path | Description |
| :--- | :--- | :--- |
| **Manager** | `src/sync/syncManager.ts` | Core logic for processing the queue and calling APIs. |
| **Queue Repo** | `src/db/repositories/syncQueue.repo.ts` | SQL operations for adding/removing queue items. |
| **Hooks** | `src/hooks/useSyncOnNetwork.ts` | React hooks that listen for online/offline events. |
| **DB Schema** | `src/db/schema.ts` | Definition of the `sync_queue` table. |
