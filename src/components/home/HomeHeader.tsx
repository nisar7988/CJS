import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuthStore } from "../../store/auth.store";

interface HomeHeaderProps {
    userName: string;
}

export default function HomeHeader({ userName }: HomeHeaderProps) {
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                    },
                },
            ]
        );
    };

    return (
        <View className="flex-row items-center justify-between">
            <View>
                <Text className="text-gray-500">Welcome back,</Text>
                <Text className="text-2xl font-bold text-gray-900">{userName}</Text>
            </View>

            {/* Avatar */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLogout}
                className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center"
            >
                <Text className="text-white font-bold text-lg">{userName?.charAt(0)}</Text>
            </TouchableOpacity>
        </View>
    );
}
