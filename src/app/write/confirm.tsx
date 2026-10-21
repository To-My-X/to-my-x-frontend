import { Redirect, router } from 'expo-router';
import { ConfirmScreen } from '@/features/writing/ConfirmScreen';
import { useWritingSession } from '@/features/writing/writing-session';
import { validBody } from '@/features/writing/body-rules';
export default function ConfirmRoute() {
  const { draft } = useWritingSession();
  if (!validBody(draft.body)) return <Redirect href="/write" />;
  return <ConfirmScreen onEdit={() => router.dismissTo('/write')} />;
}
