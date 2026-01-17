import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useNetworkStore } from '../store/network.store';
import { SyncManager } from '../sync/syncManager';

export const useSyncOnNetwork = () => {
    const isOnline = useNetworkStore((state) => state.isOnline);

    useEffect(() => {
        if (isOnline) {
            SyncManager.processQueue();
        }
    }, [isOnline]);
};

export const useSyncOnForeground = () => {
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                SyncManager.processQueue();
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);
};
