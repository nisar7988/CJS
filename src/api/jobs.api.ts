import api from './axios';
import { Job, CreateJobPayload, CreateJobMediaPayload } from '../types/models';
import { API } from './api';

export const JobsApi = {
    getAll: async () => {
        return api.get<Job[]>(API.JOBS.LIST);
    },

    create: async (job: CreateJobPayload) => {
        return api.post<Job>(API.JOBS.CREATE, job);
    },

    update: async (id: string, updates: CreateJobPayload) => {
        return api.put<Job>(API.JOBS.UPDATE(id), updates);
    },

    addSiteVideo: async (jobId: string, payload: CreateJobMediaPayload) => {
        const formData = new FormData();
        formData.append('image', payload.image);
        formData.append('clientVideoId', payload.clientVideoId);

        return api.post(API.JOBS.ADD_SITE_VIDEO(jobId), formData);
    },

    delete: async (id: string) => {
        return api.delete(API.JOBS.UPDATE(id));
    }
};
