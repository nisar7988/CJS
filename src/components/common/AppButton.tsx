import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AppButtonProps {
    /** Text shown on the button (defaults to "Button") */
    title?: string;
    /** Callback when the button is pressed */
    onPress: () => void;
    /** Disable the button (defaults to false) */
    disabled?: boolean;
    /** Show a loading spinner instead of the title (defaults to false) */
    loading?: boolean;
    /** Additional Tailwind‑style classes for the outer Pressable */
    className?: string;
    /** Additional Tailwind‑style classes for the inner Text */
    textClassName?: string;
    /** Gradient colors – defaults to a blue gradient */
    colors?: string[];
}

/**
 * A reusable button component with a linear‑gradient background.
 */
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