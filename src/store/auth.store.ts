import { create } from 'zustand';
import { storage } from '../utils/storage';
import { AuthApi } from '../api/auth.api';
import { User } from '../types/auth';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    loadSession: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await AuthApi.login(email, password);
            // API returns { success, data: { token, ...user } }
            const { token, ...user } = response.data;

            if (!token) {
                throw new Error('Token missing in response');
            }

            await storage.setItem('auth_token', token);
            await storage.setItem('auth_user', JSON.stringify(user));
            set({ isAuthenticated: true, user: user as User, token, isLoading: false });
        } catch (e: any) {
            console.error('Login failed', e);
            const msg = e.response?.data?.message || 'Login failed. Please check your credentials.';
            set({ error: msg, isLoading: false });
            throw e;
        }
    },

    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await AuthApi.signup(email, password, name);
            const { token, ...user } = response.data;

            if (!token) {
                throw new Error('Token missing in response');
            }

            await storage.setItem('auth_token', token);
            await storage.setItem('auth_user', JSON.stringify(user));
            set({ isAuthenticated: true, user: user as User, token, isLoading: false });
        } catch (e: any) {
            console.error('Signup failed', e);
            const msg = e.response?.data?.message || 'Signup failed. Please try again.';
            set({ error: msg, isLoading: false });
            throw e;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await AuthApi.logout();
        } catch (e) {
            console.warn('Logout API call failed, clearing local state anyway', e);
        } finally {
            await storage.removeItem('auth_token');
            await storage.removeItem('auth_user');
            set({ isAuthenticated: false, user: null, token: null, isLoading: false });
        }
    },

    loadSession: async () => {
        set({ isLoading: true });
        try {
            const [token, savedUserStr] = await Promise.all([
                storage.getItem('auth_token'),
                storage.getItem('auth_user')
            ]);

            if (token && savedUserStr) {
                const savedUser = JSON.parse(savedUserStr);
                // Optimistically set the user
                set({ isAuthenticated: true, token, user: savedUser });

                // Then verify/update in background
                try {
                    const user = await AuthApi.myProfile();
                    // Update store and storage with latest data
                    await storage.setItem('auth_user', JSON.stringify(user));
                    set({ user });
                } catch (e: any) {
                    console.error('Failed to refresh profile', e);
                    // Only logout if it's strictly an auth error (401)
                    if (e.response?.status === 401) {
                        await storage.removeItem('auth_token');
                        await storage.removeItem('auth_user');
                        set({ isAuthenticated: false, token: null, user: null });
                    }
                    // For other errors (network, 500), we stay logged in with cached data
                }
            } else if (token) {
                // Token exists but no user data (migration case or cleared storage)
                try {
                    const user = await AuthApi.myProfile();
                    await storage.setItem('auth_user', JSON.stringify(user));
                    set({ isAuthenticated: true, token, user });
                } catch (e) {
                    // If we can't fetch user with just token, we must logout
                    await storage.removeItem('auth_token');
                    set({ isAuthenticated: false, token: null, user: null });
                }
            } else {
                set({ isAuthenticated: false, token: null, user: null });
            }
        } catch (error) {
            console.error('Failed to load session', error);
            set({ isAuthenticated: false, token: null, user: null });
        } finally {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));
