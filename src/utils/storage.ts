import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const storage = {
    setItem: async (key: string, value: string) => {
        try {
            if (key === 'auth_token') {
                await SecureStore.setItemAsync(key, value);
            } else {
                await AsyncStorage.setItem(key, value);
            }
        } catch (e) {
            console.error('Storage setItem error', e);
        }
    },
    getItem: async (key: string) => {
        try {
            if (key === 'auth_token') {
                return await SecureStore.getItemAsync(key);
            }
            return await AsyncStorage.getItem(key);
        } catch (e) {
            console.error('Storage getItem error', e);
            return null;
        }
    },
    removeItem: async (key: string) => {
        try {
            if (key === 'auth_token') {
                await SecureStore.deleteItemAsync(key);
            } else {
                await AsyncStorage.removeItem(key);
            }
        } catch (e) {
            console.error('Storage removeItem error', e);
        }
    },
    clear: async () => {
        try {
            await AsyncStorage.clear();
            await SecureStore.deleteItemAsync('auth_token');
        } catch (e) {
            console.error('Storage clear error', e);
        }
    }
};
