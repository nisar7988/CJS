import axios from 'axios';
import api from './axios';
import { storage } from '../utils/storage';
import { Job, CreateJobPayload, CreateJobMediaPayload } from '../types/models';
import { API } from './api';

export const JobsApi = {
    getAll: async () => {
        return api.get<Job[]>(API.JOBS.LIST);
    },

    create: async (job: CreateJobPayload) => {
        return api.post<Job>(API.JOBS.CREATE, job);
    },
    getJobById: async (id: string) => {
        return api.get<any>(API.JOBS.DETAILS(id));
    },

    update: async (id: string, updates: CreateJobPayload) => {
        return api.put<Job>(API.JOBS.UPDATE(id), updates);
    },

    addSiteVideo: async (jobId: string, payload: CreateJobMediaPayload) => {
        const formData = new FormData();
        // payload.image is expected to be { uri, name, type } which RN/Expo needs
        formData.append('image', payload.image as any);
        formData.append('clientVideoId', payload.clientVideoId);

        return api.post(API.JOBS.ADD_SITE_VIDEO(jobId), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    delete: async (id: string) => {
        return api.delete(API.JOBS.UPDATE(id));
    }
};
