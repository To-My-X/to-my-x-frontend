import { router, Redirect } from 'expo-router';
import { LoginScreen } from '@/features/auth/LoginScreen';
import { useMockSession } from '@/features/auth/mock-session';
export default function LoginRoute() {
  const { session, login } = useMockSession();
  if (session === 'ready') return <Redirect href="/write" />;
  return <LoginScreen onCancel={() => router.canGoBack() ? router.back() : router.replace('/')} onMockLogin={() => { login(); router.replace('/consent'); }} />;
}
