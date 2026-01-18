import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AppButtonProps {
    title?: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    textClassName?: string;
    colors?: string[];
}

export default function AppButton({
    title = "Button",
    onPress,
    disabled = false,
    loading = false,
    className = "",
    textClassName = "",
    colors = ["#3B82F6", "#2563EB"],
}: AppButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            className={`w-full ${className}`}
            style={({ pressed }) => ({
                opacity: disabled || loading ? 0.6 : pressed ? 0.85 : 1,
            })}
        >
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    borderRadius: 18,
                    paddingVertical: 16,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className={`text-white font-semibold ${textClassName}`}>
                        {title}
                    </Text>
                )}
            </LinearGradient>
        </Pressable>
    );
}

AppButton.displayName = "AppButton";