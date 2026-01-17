import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { useAuthStore } from '../../src/store/auth.store';
import { AuthApi } from '../../src/api/auth.api';

export default function MainLayout() {
    const logout = useAuthStore(state => state.logout);

    const handleLogout = async () => {
        try {
            await AuthApi.logout();
        } catch (e) { /* ignore */ }
        await logout();
    };

    return (
        <Stack>
            <Stack.Screen
                name="jobs/index"
                options={{
                    headerShown: false,
                    title: 'My Jobs',
                    headerRight: () => (
                        <TouchableOpacity onPress={handleLogout}>
                            <Text className="text-primary font-bold">Logout</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen name="jobs/create" options={{ title: 'New Job', headerShown: false }} />
            <Stack.Screen name="jobs/[jobId]" options={{ title: 'Job Details', headerShown: false }} />
            <Stack.Screen name="jobs/edit/[jobId]" options={{ title: 'Edit Job', headerShown: false }} />
            <Stack.Screen name="notes/create" options={{ title: 'New Note', presentation: 'modal' }} />
            <Stack.Screen name="notes/edit/[noteId]" options={{ title: 'Edit Note', presentation: 'modal' }} />
        </Stack>
    );
}
