import { Redirect, router } from 'expo-router';
import { useMockSession } from '@/features/auth/mock-session';
import { DeleteAccountScreen } from '@/features/settings/DeleteAccountScreen';

export default function DeleteAccountRoute() {
  const { session, cancel } = useMockSession();
  if (session !== 'ready') return <Redirect href={{ pathname: '/login', params: { next: 'settings' } }} />;
  return <DeleteAccountScreen
    onBack={() => router.canGoBack() ? router.back() : router.replace('/settings')}
    onFinish={() => { cancel(); router.dismissTo('/'); }} />;
}
