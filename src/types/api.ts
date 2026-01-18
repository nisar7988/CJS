

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


export type CreateJobRequest = {
    clientJobId: string;
    title: string;
    location: string;
    description: string;
    budget: number;
};

export type UpdateJobRequest = CreateJobRequest;

export type JobResponse = {
    id: string;
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


export type CreateNoteRequest = {
    clientNoteId: string;
    text: string;
};

export type UpdateNoteRequest = {
    text: string;
};

export type NoteResponse = {
    id: string;
    clientNoteId: string;
    text: string;
    createdAt?: string;
    updatedAt?: string;
};


export type UploadVideoFormData = {
    videoFile: any; // Expo File object OR RN file object
    clientVideoId: string;
};
