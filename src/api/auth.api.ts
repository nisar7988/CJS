import api from './axios';
import { API } from './api';
import { AuthResponse, User } from '../types/auth';

export const AuthApi = {
    login: async (email: string, password: string) => {
        const response = await api.post<AuthResponse>(API.AUTH.LOGIN, { email, password });
        console.log("response of login", response.data);
        return response.data;
    },

    signup: async (email: string, password: string, name: string) => {
        const response = await api.post<AuthResponse>(API.AUTH.REGISTER, { email, password, name });
        console.log("response of signup", response.data);
        return response.data;
    },

    logout: async () => {
        const response = await api.post(API.AUTH.LOGOUT);
        return response.data;
    },

    myProfile: async () => {
        const response = await api.get<{ success: boolean; data: User }>(API.AUTH.MY_PROFILE);
        return response.data.data;
    }
};


