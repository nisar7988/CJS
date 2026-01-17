import React from 'react';
import { View, Text } from 'react-native';
import { useNetworkStore } from '../../store/network.store';

export const OfflineBanner: React.FC = () => {
    const isOnline = useNetworkStore((state) => state.isOnline);

    if (isOnline) return null;

    return (
        <View className="bg-danger p-2 items-center justify-center safe-area-inset-top">
            <Text className="text-textOnPrimary text-xs font-bold">You are currently offline</Text>
        </View>
    );
};
