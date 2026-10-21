import { Redirect, router } from 'expo-router';
import { useEffect } from 'react';
import { ConsentScreen } from '@/features/auth/ConsentScreen';
import { useMockSession } from '@/features/auth/mock-session';
export default function ConsentRoute() {
  const { session, agree, cancel, cancelPending } = useMockSession();
  useEffect(() => () => cancelPending(), [cancelPending]);
  if (!__DEV__ || session === 'guest') return <Redirect href="/login" />;
  return <ConsentScreen onCancel={() => { cancel(); router.dismissTo('/'); }} onContinue={() => { agree(); router.replace('/write'); }} />;
}
