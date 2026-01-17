// src/types/api.ts

// ----------------------
// AUTH
// ----------------------

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type AuthResponse = {
    token: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
};

export type MyProfileResponse = {
    id: string;
    name: string;
    email: string;
};

// ----------------------
// JOBS
// ----------------------

export type CreateJobRequest = {
    clientJobId: string; // generated locally (uuid)
    title: string;
    location: string;
    description: string;
    budget: number;
};

export type UpdateJobRequest = CreateJobRequest;

export type JobResponse = {
    id: string; // server job id
    clientJobId: string;
    title: string;
    location: string;
    description: string;
    budget: number;
    createdAt?: string;
    updatedAt?: string;
};

export type JobListResponse = JobResponse[];

export type JobDetailsResponse = JobResponse & {
    notes?: NoteResponse[];
    siteVideo?: {
        id: string;
        clientVideoId: string;
        url?: string;
    };
};

// ----------------------
// NOTES
// ----------------------

export type CreateNoteRequest = {
    clientNoteId: string; // generated locally (uuid)
    text: string;
};

export type UpdateNoteRequest = {
    text: string;
};

export type NoteResponse = {
    id: string; // server note id
    clientNoteId: string;
    text: string;
    createdAt?: string;
    updatedAt?: string;
};

// ----------------------
// VIDEO UPLOAD (multipart)
// ----------------------

export type UploadVideoFormData = {
    videoFile: any; // Expo File object OR RN file object
    clientVideoId: string;
};
