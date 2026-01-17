import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../store/auth.store';

export const useAuthGuard = () => {
    const { isAuthenticated, loadSession } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    // Load session on mount
    useEffect(() => {
        loadSession();
    }, []);

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to the sign-in page.
            router.replace('/(auth)/login');
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace('/(main)/jobs');
        }
    }, [isAuthenticated, segments]);
};
