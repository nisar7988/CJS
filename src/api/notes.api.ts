import api from './axios';
import { Note, CreateJobNotesPayload } from '../types/models';
import { API } from './api';

export const NotesApi = {
    getByJobId: async (jobId: string) => {
        return api.get<Note[]>(API.JOBS.ADD_NOTE(jobId));
    },

    create: async (jobId: string, note: CreateJobNotesPayload) => {
        return api.post<Note>(API.JOBS.ADD_NOTE(jobId), note);
    },

    update: async (jobId: string, id: string, content: string) => {
        return api.put<Note>(API.JOBS.UPDATE_NOTE(jobId, id), { text: content });
    },

    delete: async (jobId: string, id: string) => {
        return api.delete(API.JOBS.UPDATE_NOTE(jobId, id));
    }
};
