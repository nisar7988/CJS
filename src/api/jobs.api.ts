import api from './axios';
import { Job } from '../types/models';
import { API } from './api';

export const JobsApi = {
    getAll: async () => {
        return api.get<Job[]>(API.JOBS.LIST);
    },

    create: async (job: Partial<Job>) => {
        return api.post<Job>(API.JOBS.CREATE, job);
    },

    update: async (id: string, updates: Partial<Job>) => {
        return api.put<Job>(API.JOBS.UPDATE(id), updates);
    },

    delete: async (id: string) => {
        return api.delete(API.JOBS.UPDATE(id));
    }
};
