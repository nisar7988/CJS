import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../../../constants/theme';

export const Loader: React.FC = () => {
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
    );
};
