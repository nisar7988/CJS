import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useNetworkStore } from '../store/network.store';
import { SyncManager } from '../sync/syncManager';

export const useSyncOnNetwork = (enabled: boolean = true) => {
    const isOnline = useNetworkStore((state) => state.isOnline);

    useEffect(() => {
        if (isOnline && enabled) {
            SyncManager.processQueue();
        }
    }, [isOnline, enabled]);
};

export const useSyncOnForeground = (enabled: boolean = true) => {
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active' && enabled) {
                SyncManager.processQueue();
            }
        });

        return () => {
            subscription.remove();
        };
    }, [enabled]);
};
