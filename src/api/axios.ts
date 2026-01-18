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
            await storage.removeItem('auth_token');
            const { useAuthStore } = require('../store/auth.store');
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default api;
