import React from 'react';
import { View, Text } from 'react-native';

export const EmptyState: React.FC<{ message: string }> = ({ message }) => {
    return (
        <View className="flex-1 justify-center items-center p-8">
            <Text className="text-gray-500 text-lg text-center">{message}</Text>
        </View>
    );
};
