import api from './axios';
import { Note } from '../types/models';
import { API } from './api';

export const NotesApi = {
    getByJobId: async (jobId: string) => {
        return api.get<Note[]>(API.JOBS.ADD_NOTE(jobId));
    },

    create: async (note: Partial<Note>) => {
        if (!note.job_id) throw new Error('Job ID is required');
        return api.post<Note>(API.JOBS.ADD_NOTE(note.job_id), note);
    },

    update: async (jobId: string, id: string, content: string) => {
        return api.put<Note>(API.JOBS.UPDATE_NOTE(jobId, id), { content });
    },

    delete: async (jobId: string, id: string) => {
        return api.delete(API.JOBS.UPDATE_NOTE(jobId, id));
    }
};
