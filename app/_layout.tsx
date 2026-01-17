import React, { useEffect, useState } from 'react';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDatabase } from '../src/db/init';
import { useAuthStore } from '../src/store/auth.store';
import { useSyncOnNetwork, useSyncOnForeground } from '../src/hooks/useSyncOnNetwork';
import { OfflineBanner } from '../src/components/status/OfflineBanner';
import { Loader } from '../src/components/common/Loader';
import '../global.css';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const loadSession = useAuthStore(state => state.loadSession);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        await loadSession();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  // Global Sync Hooks
  useSyncOnNetwork();
  useSyncOnForeground();

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {

      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isReady, isAuthenticated, segments]);


  if (!isReady) {
    return <Loader />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <OfflineBanner />
      <Slot />
    </SafeAreaProvider>
  );
}
