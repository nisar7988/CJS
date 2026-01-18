# Job Application - Offline-First Architecture

This project is an **offline-first mobile application** built with **Expo (React Native)**. It allows users to manage job applications and related notes seamlessly, even without an internet connection. Changes made offline are queued and synchronized with the backend server when connectivity is restored.

## 🚀 Key Features

*   **Offline-First**: Full read/write functionality without internet access.
*   **Background Sync**: Automatically syncs local changes when the device comes back online.
*   **Authentication**: Secure, persistent user sessions.
*   **Job Management**: Create, edit, and track job applications.
*   **Notes System**: Add notes to specific job applications.

## 🛠 Tech Stack

*   **Framework**: [Expo](https://expo.dev) / React Native
*   **Language**: TypeScript
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Local Database**: [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
*   **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
*   **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction)
*   **API Client**: Axios

## 📂 Project Structure

```
my-app/
├── app/                  # Expo Router pages (Navigation)
│   ├── (auth)/           # Authentication screens (Login, Signup)
│   ├── (main)/           # Main app flow (Jobs, Notes)
│   ├── (tabs)/           # Tab bar navigation
│   └── _layout.tsx       # Root layout & global providers
├── src/
│   ├── api/              # HTTP API definitions
│   ├── components/       # Reusable UI components
│   ├── db/               # Local SQLite database setup
│   │   ├── repositories/ # Data access layer (Reading/Writing to DB)
│   │   └── schema.ts     # Database table definitions
│   ├── hooks/            # Custom React hooks (e.g., Sync hooks)
│   ├── store/            # Global state (Auth, Network status)
│   ├── sync/             # Synchronization logic (SyncManager)
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Helper functions
```

## 🔄 Application Flow

### 1. Authentication Flow
*   **State**: Managed by `src/store/auth.store.ts`.
*   **Persistence**: Tokens and user data are stored securely using `expo-secure-store`.
*   **Startup**:
    1.  App launches (`app/_layout.tsx`).
    2.  `initDatabase()` initializes SQLite tables.
    3.  `loadSession()` checks for stored credentials.
    4.  If valid, user is directed to `(tabs)`; otherwise, to `(auth)/welcome`.

### 2. Data Flow (Offline-First)

The app follows a **Local-First** strategy. The UI interaction is always with the local database, ensuring instant feedback.

#### Reading Data
*   **UI Component** calls a Repository (e.g., `JobsRepo.getAll()`).
*   **Repository** queries the local **SQLite Database**.
*   **Data** is returned to the UI.
*   *Note: Using the local DB as the single source of truth ensures the UI works identical online or offline.*

#### Writing Data (Create/Update/Delete)
1.  **User Action**: User creates a new Job.
2.  **Repo Call**: `JobsRepo.create(jobData)` is called.
3.  **Local Commit**:
    *   The Job is inserted into the local `jobs` table with `synced = 0`.
    *   A corresponding action is added to the `sync_queue` table (e.g., `action: 'CREATE_JOB'`).
4.  **UI Update**: The UI reflects the change immediately by re-fetching from the local DB.

### 3. Synchronization Flow

Synchronization is handled by the `SyncManager` (`src/sync/syncManager.ts`).

*   **Trigger**: Sync is triggered when:
    *   The app opens.
    *   Network status changes to "Connected".
    *   New items are added to the queue (if already online).
*   **Process**:
    1.  `SyncManager` reads the `sync_queue` table.
    2.  It iterates through pending actions (FIFO order).
    3.  For each action, it executes the corresponding API call (e.g., `JobsApi.create`).
    4.  **On Success**:
        *   The item is removed from the `sync_queue`.
        *   The local record is updated (e.g., `synced = 1`) via `JobsRepo.markSynced()`.
    5.  **On Failure**: The item remains in the queue to be retried later.

## 💾 Database Schema

*   **`jobs`**: Stores job application details (`id`, `title`, `company`, `status`, `synced`, etc.).
*   **`notes`**: Stores notes linked to jobs via `job_id`.
*   **`sync_queue`**: Stores pending offline actions (`id`, `action`, `payload`).

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the App**:
    ```bash
    npx expo start
    ```

3.  **Reset Project** (Optional):
    If you need to clear the local database and start fresh:
    ```bash
    npm run reset-project
    ```
