import React from 'react';
import { View, Text } from 'react-native';

export const SyncBadge: React.FC<{ synced: number }> = ({ synced }) => {
    if (synced) return null;

    return (
        <View className="bg-warningLight px-2 py-1 rounded border border-warning">
            <Text className="text-warning text-xs font-bold">Unsynced</Text>
        </View>
    );
};
