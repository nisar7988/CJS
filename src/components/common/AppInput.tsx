import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface AppInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

const AppInput: React.FC<AppInputProps> = ({ label, error, ...props }) => {
    return (
        <View className="mb-4">
            {label && <Text className="text-text font-medium mb-1">{label}</Text>}
            <TextInput
                className={`border p-3 rounded-lg bg-surface ${error ? 'border-danger' : 'border-border'}`}
                placeholderTextColor="#94A3B8"
                {...props}
            />
            {error && <Text className="text-danger text-sm mt-1">{error}</Text>}
        </View>
    );
};
export default AppInput;