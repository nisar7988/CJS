# Job Management Mobile App

A modern, offline-first mobile application for managing jobs, notes, and video uploads. Built with React Native, Expo, and TypeScript.

##  Tech Stack

-   **Framework**: [Expo](https://expo.dev/) (React Native)
-   **Language**: TypeScript
-   **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Database**: [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) (Local database)
-   **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
-   **API**: Axios

##  Project Structure

## `app/` (Expo Router)
-   **`(auth)`**: Contains login/signup screens. These are protected routes accessible only when unauthenticated.
-   **`(tabs)`**: The main application interface with bottom tab navigation.
-   **`(main)`**: Stack screens for deeper navigation (e.g., Job Details, Add Note).
-   **`_layout.tsx`**: The entry point. It initializes the database (`initDatabase`), loads the user session, and enforces authentication rules (redirects to Login if no token found).

### `src/` (Core Logic)
-   **`api/`**: Centralized API layer.
    -   `axios.ts`: Configures the global Axios instance with:
        -   **Request Interceptor**: Injects `Authorization: Bearer <token>` from local storage.
        -   **Response Interceptor**: Automatically logs the user out on `401 Unauthorized` errors.
    -   `jobs.api.ts`: Encapsulates endpoints for manipulating jobs and uploading media (uses `FormData`).
-   **`db/`**: Local SQLite database layer.
    -   `repositories/`: Abstract direct SQL queries. For example, `jobs.repo.ts` handles creating a job locally *and* queuing an action in `sync_queue`.
    -   `schema.ts`: Defines SQL tables (`jobs`, `notes`, `videos`, `sync_queue`).
-   **`sync/`**: The heart of the offline-first logic.
    -   `syncManager.ts`: Watches the network status. When online, it processes the `sync_queue` (FIFO) and pulls fresh data from the server.
-   **`store/`**: Global state management using **Zustand**.
    -   `auth.store.ts`: Manages user session, token storage, and login/logout actions.

##  API Handling

The application uses a centralized **Axios** instance (`src/api/axios.ts`) to ensure consistency.

1.  **Authentication**: The app stores the JWT token in `AsyncStorage`. Every API request automatically includes this token in the header.
2.  **Error Handling**: If the token expires or validity fails (401), the app automatically clears the session and redirects the user to the login screen.
3.  **Media Uploads**: Detailed in `JobsApi.addSiteVideo`, the app constructs a `FormData` object to handle video uploads, ensuring compatible `uri` and `type` fields for React Native.

## Database & Sync Architecture

We use a **Repository Pattern** to decouple the UI from the database.

1.  **Dual-Write Strategy**: When a user creates a job:
    -   **Step 1**: It is immediately written to the local SQLite `jobs` table (User sees it instantly).
    -   **Step 2**: An action (`CREATE_JOB`) is written to the `sync_queue` table.
2.  **Sync Process**:
    -   The `SyncManager` monitors network connectivity.
    -   **On Connect**: It iterates through the `sync_queue`, executing the API calls one by one.
    -   **On Success**: The server returns the "real" ID. The local database is updated to map the local `id` to the `server_id`.

## Application Workflow

1.  **Authentication**: Users start at the Welcome screen. They must Login or Signup to access the app.
2.  **Dashboard (Home)**: Displays a list of jobs.
    -   **Pull to Refresh**: Triggers a sync with the server.
3.  **Create Job**: users can add new jobs (works offline).
4.  **Job Details**: Click a job to view details.
    -   **Tabs**: Switch between Details, Notes, and Videos.
    -   **Add Note**: Attach text notes to the job.
    -   **Upload Video**: Select and upload videos (queued if offline).
5.  **Offline Mode**: A banner appears when offline. Actions are queued and auto-synced when the network returns.

##  Offline Sync Flow



1. The user performs an action (create or update a job).
2. The app checks if the device is online.

3. If the device is online:
   - The app calls the API immediately.
   - The server responds with success and (if needed) a server-generated ID.
   - The app updates the local SQLite database with the latest server data.

4. If the device is offline:
   - The app saves the change in local SQLite immediately.
   - The app adds the action into a Sync Queue (pending tasks list).

5. When the network is restored:
   - The Sync Manager automatically starts processing the Sync Queue.
   - Each queued request is sent to the server one by one (FIFO).
   - Once a request succeeds, the local database is updated to match the server.
   - The synced queue item is marked as completed.


### Video Uploads
Video uploads are handled separately with a retry mechanism:
1.  Video is saved locally.
2.  Added to `sync_queue` with status `PENDING`.
3.  `SyncManager` attempts upload when online.
4.  On failure, increments retry count (Max 3).

##  Getting Started

### Prerequisites

-   Node.js (> 18)
-   Device or Emulator (Android Studio / Xcode)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd my-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm start
    ```

4.  **Run on device/emulator**
    -   Android: `npm run android`
    -   iOS: `npm run ios`

### Run on physical device (Expo Go)

- Install Expo Go from Play Store (Android) or App Store (iOS).
- Connect your phone and computer to the same Wi‑Fi network.
- Start the dev server with `npm start`; a QR code will appear.
- Open Expo Go and scan the QR code or enter the URL shown.
- If LAN fails, switch the connection mode to “Tunnel” and try again.

