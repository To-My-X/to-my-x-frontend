import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ConsentScreen } from '@/features/auth/ConsentScreen';
import { mockAuthEnabled, useMockSession } from '@/features/auth/mock-session';
import { resolveReturn } from '@/features/auth/return-target';

export default function ConsentRoute() {
  const { session, agree, cancel, cancelPending } = useMockSession();
  const { next } = useLocalSearchParams<{ next?: string }>();
  useEffect(() => () => cancelPending(), [cancelPending]);
  if (!mockAuthEnabled || session === 'guest') return <Redirect href="/login" />;
  return <ConsentScreen onCancel={() => { cancel(); router.dismissTo('/'); }} onContinue={() => { agree(); router.replace(resolveReturn(next)); }} />;
}
