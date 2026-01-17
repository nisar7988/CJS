import React from "react";
import { View, Text } from "react-native";

interface HomeHeaderProps {
    userName: string;
}

export default function HomeHeader({ userName }: HomeHeaderProps) {
    return (
        <View className="flex-row items-center justify-between">
            <View>
                <Text className="text-gray-500">Welcome back,</Text>
                <Text className="text-2xl font-bold text-gray-900">{userName}</Text>
            </View>

            {/* Avatar */}
            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center">
                <Text className="text-white font-bold text-lg">{userName.charAt(0)}</Text>
            </View>
        </View>
    );
}
