import { create } from 'zustand';
import NetInfo from '@react-native-community/netinfo';

interface NetworkState {
    isOnline: boolean;
    setIsOnline: (status: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
    isOnline: true, // Default to true, listener will update
    setIsOnline: (status) => set({ isOnline: status }),
}));

// Initialize listener
NetInfo.addEventListener(state => {
    useNetworkStore.getState().setIsOnline(!!state.isConnected);
});
