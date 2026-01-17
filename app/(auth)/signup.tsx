import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import AppInput from '../../src/components/common/AppInput';
import { useAuthStore } from '../../src/store/auth.store';
import { Image } from 'react-native';
import AppButton from '../../src/components/common/AppButton';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
    const router = useRouter();
    const { signup, isLoading, error } = useAuthStore();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (!email || !password || !name) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            await signup(email, password, name);
            // Auto login successful, navigate to home
            router.replace('/');
        } catch (e) {
            // Error handled in store
        }
    };

    return (
        <View className="flex-1 justify-center p-6 bg-background">
            <TouchableOpacity onPress={() => router.back()}
                className='absolute top-12 left-8 bg-white rounded-full p-2'
            >
                <Ionicons name='arrow-back' size={24} color='black' />
            </TouchableOpacity>
            <Image source={require('../../assets/images/logo.png')} className="w-32 h-32 mx-auto mb-8" />
            <Text className="text-3xl font-bold mb-8 text-center text-primary">Create Account</Text>

            <AppInput
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
            />

            <AppInput
                label="Email"
                placeholder="user@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <AppInput
                label="Password"
                placeholder="••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <View className="mt-4">
                {error && <Text className="text-red-500 text-center mb-2">{error}</Text>}
                <AppButton title="Sign Up" onPress={handleSignup} loading={isLoading} />
            </View>

            <Link href="/(auth)/login" asChild>
                <Text className="text-center mt-6 text-textMuted">
                    Already have an account? <Text className="text-primary font-bold">Login</Text>
                </Text>
            </Link>
        </View>
    );
}
