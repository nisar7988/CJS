import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../constants/theme';

interface FABProps {
    onPress?: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
    // Optional route to navigate to. If provided, onPress is ignored or handled alongside navigation.
    href?: string;
}

export const FAB: React.FC<FABProps> = ({ onPress, icon = 'add', href }) => {
    const router = useRouter();

    const handlePress = () => {
        if (href) {
            router.push(href as any);
        }
        if (onPress) {
            onPress();
        }
    };

    return (
        <TouchableOpacity
            style={styles.fab}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <Ionicons name={icon} size={30} color="#FFF" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary, // Using theme color
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
    },
});
