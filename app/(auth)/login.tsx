import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import AppInput from '../../src/components/common/AppInput';
import AppButton from '../../src/components/common/AppButton';
import { useAuthStore } from '../../src/store/auth.store';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading, error } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // ✅ new state

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        try {
            await login(email, password);
            router.replace('/');
        } catch (e) { }
    };

    return (
        <View className="flex-1 justify-center p-6 bg-background">
            <TouchableOpacity
                onPress={() => router.back()}
                className="absolute top-12 left-8 bg-white rounded-full p-2"
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Image
                source={require('../../assets/images/logo.png')}
                className="w-32 h-32 mx-auto mb-8"
            />

            <Text className="text-3xl font-bold mb-8 text-center text-primary">
                JobSync
            </Text>

            <AppInput
                label="Email"
                placeholder="user@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            {/* ✅ Password with Eye Button */}
            <View className="relative">
                <AppInput
                    label="Password"
                    placeholder="••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword} // ✅ toggle here
                />

                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-8"
                >
                    <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={22}
                        color="gray"
                    />
                </TouchableOpacity>
            </View>

            <View className="mt-4">
                {error && <Text className="text-red-500 text-center mb-2">{error}</Text>}
                <AppButton title="Sign In" onPress={handleLogin} loading={isLoading} />
            </View>

            <Link href="/(auth)/signup" asChild>
                <Text className="text-center mt-6 text-textMuted">
                    Don't have an account?{' '}
                    <Text className="text-primary font-bold">Sign Up</Text>
                </Text>
            </Link>
        </View>
    );
}
