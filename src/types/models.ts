// src/types/models.ts

export interface Job {
    id: string; // This corresponds to client job UUID (local)
    server_id?: string; // This corresponds to _id from server
    title: string;
    location: string;
    budget: number;
    description: string;
    created_at: number;
    updated_at: number;
    synced: number; // 0 or 1
    user_id?: string;
}

export interface Note {
    id: string; // client note UUID
    server_id?: string; // _id from server
    job_id: string; // This is the local UUID of the job
    content: string;
    created_at: number;
    updated_at: number;
    synced: number; // 0 or 1
}

export interface SyncItem {
    id?: number;
    action: string; // 'CREATE_JOB' | 'UPDATE_JOB' | 'DELETE_JOB' | 'CREATE_NOTE' | 'VIDEO_UPLOAD'
    payload: string; // JSON string
    created_at: number;
}

export type VideoStatus = 'PENDING' | 'UPLOADING' | 'UPLOADED' | 'FAILED';

export interface Video {
    id: string; // client video UUID
    server_id?: string;
    job_id: string;
    file_uri: string;
    status: VideoStatus;
    retry_count: number;
    error_message?: string;
    created_at: number;
    updated_at: number;
}

// Swagger Schema Types
export interface CreateJobPayload {
    clientJobId: string;
    title: string;
    location: string;
    description: string;
    budget: number;
}

export interface CreateJobMediaPayload {
    image: any; // Blob or FormData entry
    clientVideoId: string;
}

export interface CreateJobNotesPayload {
    clientNoteId: string;
    text: string;
}
