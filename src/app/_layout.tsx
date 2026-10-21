import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { tokens } from '@/theme/tokens';
import '@/global.css';
import { MockSessionProvider } from '@/features/auth/mock-session';
import { WritingSessionProvider } from '@/features/writing/writing-session';

void SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, error] = useFonts({
    MaruBuri: require('@/assets/fonts/MaruBuri-Regular.ttf'),
    Pretendard: require('@/assets/fonts/Pretendard-Regular.otf'),
  });
  useEffect(() => { if (loaded || error) void SplashScreen.hideAsync(); }, [loaded, error]);
  if (!loaded && !error) return null;
  return <MockSessionProvider><WritingSessionProvider><StatusBar style="light" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: tokens.background } }}><Stack.Screen name="login" options={{ presentation: 'transparentModal', contentStyle: { backgroundColor: 'transparent' } }} /></Stack></WritingSessionProvider></MockSessionProvider>;
}
