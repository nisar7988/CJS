# Understanding Offline-First Syncing (The "Outbox" Pattern)

This guide explains how your app talks to the server, even though it writes everything to stored files (SQLite) first. Use this to understand the logic flow "from zero".

## 1. The Core Idea: "Write Local, Upload Later"

Imagine you are writing letters (data) to your friend (the Backend Server).

*   **Online Only App**: You call your friend immediately. If they don't answer (no internet), you can't say anything. The app crashes or shows an error.
*   **Offline-First App (Your App)**: You write the letter and put it in your **Mailbox (Sync Queue)**.
    *   You see the letter is "written" immediately (Local SQLite).
    *   The Mailman (Sync Manager) checks the mailbox.
    *   If the road is clear (Internet is On), the Mailman delivers the letters one by one.

## 2. Why "No Special Endpoint"?

You asked: *"How does backend update ... if it has no special endpoint for syncing?"*

**The Trick:** We simply **replay** the actions using the **Standard API endpoints**.

The backend serves the exact same `POST /jobs` endpoint for:
1.  A live user clicking "Save" on a website.
2.  Your mobile app "syncing" a job you created 3 hours ago while on an airplane.

The backend *doesn't know* you made the change while offline. It just receives a standard request: "Hey, create this job."

## 3. Step-by-Step Example: Creating a Job

Let's trace exactly what happens when you click "Create Job" while your phone is **Offline**.

### Step A: The User Action (Offline) 📱
You fill out the form for "Software Engineer" and click **Save**.

1.  **Immediate Feedback**: The app saves this job into your **Local SQLite `jobs` table**.
    *   *Result*: You see the job in your list instantly. It looks done.
2.  **The "Note to Self" (The Queue)**: The app silently adds a row to the **`sync_queue` table**.
    *   *Content*: "Action: `CREATE_JOB`, Data: { title: 'Software Engineer', ... }"
    *   *Analogy*: Putting the letter in the Outbox.

### Step B: Connectivity Returns 📶
You walk outside and get 4G signal.

1.  **The Trigger**: The app detects `isOnline: true`.
2.  **The Sync Manager**: It wakes up and looks at the `sync_queue` table.
    *   *It sees*: "Oh, there is 1 pending item: CREATE_JOB".

### Step C: The "Replay" (Syncing) 🔄
The Sync Manager executes the instruction.

1.  It reads the data from the queue.
2.  It makes a standard HTTP request:
    *   `POST https://api.yourbackend.com/jobs`
    *   *Body*: `{ title: 'Software Engineer', ... }`
3.  **The Backend** receives it just like any normal request and saves it to the real server database.
4.  **Cleanup**:
    *   The app deletes the item from the `sync_queue` (The letter is delivered).
    *   The app marks the local job as `synced = 1`.

## 4. Why is this better?

*   **Speed**: The user never sees a "Loading..." spinner when saving. It's instant because saving to SQLite is <10ms.
*   **Reliability**: If the API call fails (Server Error), the item **stays in the queue**. The app will try again in 5 minutes, or next time you open the app. You never lose data.

## 5. Visual Summary

```text
[ USER ]
   ⬇️ (Click Save)
[ LOCAL DB (SQLite) ] <--- User sees this immediately!
   ⬇️ (Add to Queue)
[ SYNC QUEUE TABLE ]
   ⬇️ (Waiting for Internet...)
   ⬇️
[ SYNC MANAGER ] ----> (Replays the Request) ----> [ POST /api/jobs ]
```
