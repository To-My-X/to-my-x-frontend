import { Redirect, router } from 'expo-router';
import { useMockSession } from '@/features/auth/mock-session';
import { SettingsScreen } from '@/features/settings/SettingsScreen';

export default function SettingsRoute() {
  const { session, cancel } = useMockSession();
  if (session !== 'ready') return <Redirect href={{ pathname: '/login', params: { next: 'settings' } }} />;
  return <SettingsScreen
    onBack={() => router.canGoBack() ? router.back() : router.replace('/my')}
    onLegal={kind => router.push(`/legal/${kind}`)}
    onLogout={() => { cancel(); router.dismissTo('/'); }}
    onDeleteAccount={() => router.push('/settings/delete-account')} />;
}
