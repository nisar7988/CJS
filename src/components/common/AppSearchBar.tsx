import React from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AppSearchBarProps extends TextInputProps {
    containerStyle?: string;
}

export default function AppSearchBar({ containerStyle, ...props }: AppSearchBarProps) {
    return (
        <View className={`flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 ${containerStyle}`}>
            <Ionicons name="search" size={18} color="#64748B" />
            <TextInput
                placeholderTextColor="#94A3B8"
                className="ml-3 flex-1 text-gray-800"
                {...props}
            />
        </View>
    );
}
