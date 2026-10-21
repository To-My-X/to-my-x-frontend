import { router, Redirect, useLocalSearchParams } from 'expo-router';
import { LoginScreen } from '@/features/auth/LoginScreen';
import { useMockSession } from '@/features/auth/mock-session';
import { resolveReturn } from '@/features/auth/return-target';

export default function LoginRoute() {
  const { session, login } = useMockSession();
  const { next } = useLocalSearchParams<{ next?: string }>();
  if (session === 'ready') return <Redirect href={resolveReturn(next)} />;
  return <LoginScreen onCancel={() => router.canGoBack() ? router.back() : router.replace('/')} onMockLogin={() => { login(); router.replace({ pathname: '/consent', params: next ? { next } : {} }); }} />;
}
