import './global.css';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useRouter, useSegments } from "expo-router";
import { LLMProvider, useLLMState } from '../context/LLMContext';

function NavigationGuard() {
  const { isReady } = useLLMState();
  const router = useRouter();
  const segments = useSegments();
  const [navReady, setNavReady] = useState(false);

  // Wait one tick for the navigator to fully mount
  useEffect(() => {
    const timer = setTimeout(() => setNavReady(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!navReady) return; //  block until navigator is ready

    const inDownloadScreen = (segments as string[]).includes('download_model');

    if (!isReady && !inDownloadScreen) {
      router.replace('/download_model');
    } else if (isReady && inDownloadScreen) {
      router.replace('/(tabs)');
    }
  }, [isReady, navReady, segments]);

  return null;
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LLMProvider>
        <NavigationGuard />
        <Stack screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerShadowVisible: false,
          headerTintColor: '#1A3644',
          headerTitleStyle: { fontWeight: '900', fontSize: 22 },
          headerTitleAlign: 'center',
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ title: "Settings", headerShown: true }} />
          <Stack.Screen name="conversation" options={{ title: "conversation", headerShown: true }} />
          <Stack.Screen name="pdfview" options={{ title: "Show PDF", headerShown: true }} />
          <Stack.Screen name="download_model" options={{ title: "Download Model", headerShown: false }} />
        </Stack>
      </LLMProvider>
    </GestureHandlerRootView>
  );
}