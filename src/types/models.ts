// src/types/models.ts

export interface Job {
    id: string;
    title: string;
    company: string;
    status: string;
    salary?: string;
    description?: string;
    created_at: number;
    updated_at: number;
    synced: number; // 0 or 1
}

export interface Note {
    id: string;
    job_id: string;
    content: string;
    created_at: number;
    updated_at: number;
    synced: number; // 0 or 1
}

export interface SyncItem {
    id?: number;
    action: string; // 'CREATE_JOB' | 'UPDATE_JOB' | 'DELETE_JOB' | 'CREATE_NOTE' ...
    payload: string; // JSON string
    created_at: number;
}
