import axios from 'axios';
import { storage } from '../utils/storage';
import { BASE_URL } from './api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.request.use(
    async (config) => {
        const token = await storage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // 401 Unauthorized -> Clear token and logout
            await storage.removeItem('auth_token');
            // We can't directly use hooks here, but we can rely on the store or simple navigation if possible.
            // Better to update the store state which will trigger the AuthGuard.
            const { useAuthStore } = require('../store/auth.store');
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default api;
