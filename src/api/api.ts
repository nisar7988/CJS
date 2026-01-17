// src/constants/api.ts

export const BASE_URL = "https://sandbox-job-app.bosselt.com";

export const API = {
    AUTH: {
        REGISTER: "/api/v1/auth/register",
        LOGIN: "/api/v1/auth/login",
        MY_PROFILE: "/api/v1/auth/myProfile",
        LOGOUT: "/api/v1/auth/logout",
        DELETE_ACCOUNT: "/api/v1/auth/delAccount",
    },

    JOBS: {
        CREATE: "/api/v1/jobs", // POST
        LIST: "/api/v1/jobs", // GET
        UPDATE: (jobId: string) => `/api/v1/jobs/${jobId}`, // PUT
        DETAILS: (jobId: string) => `/api/v1/job-details/${jobId}`, // GET

        ADD_SITE_VIDEO: (jobId: string) => `/api/v1/jobs/${jobId}/site-video`, // POST
        ADD_NOTE: (jobId: string) => `/api/v1/jobs/${jobId}/notes`, // POST
        UPDATE_NOTE: (jobId: string, noteId: string) =>
            `/api/v1/jobs/${jobId}/notes/${noteId}`, // PUT
    },
} as const;
