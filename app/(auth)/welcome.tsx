import React from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../../src/components/common/AppButton';

export default function WelcomeScreen() {
    const router = useRouter();
    return (
        <LinearGradient
            colors={[
                "#0F172A",
                "#1E293B",
                "#0F172A",
            ]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="flex-1 items-center justify-center"
            pointerEvents="box-none"
        >
            <LinearGradient
                colors={["rgba(34,197,94,0.20)", "transparent"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0.4, y: 0.3 }}
                className="absolute bottom-0 left-0 w-full h-72"
                pointerEvents="none"
            />

            <Image source={require('../../assets/images/logo.png')} className="w-52 h-52 ml-10" />

            <Text className="text-3xl font-bold text-primary mb-6 text-white">CJM</Text>
            <View className='w-[80%]'>
                <AppButton
                    title="Create Account"
                    className='my-2 '

                    onPress={() => router.push('/(auth)/signup')}
                />

                <AppButton
                    className='my-2  border border-white rounded-lg'
                    colors={["#1E293B", "#1E293B"]}
                    title="Sign In"
                    onPress={() => router.push('/(auth)/login')}
                />
            </View>
        </LinearGradient>
    );
}
