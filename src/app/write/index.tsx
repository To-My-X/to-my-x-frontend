import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { EditorScreen } from '@/features/writing/EditorScreen';
import { useWritingSession } from '@/features/writing/writing-session';

export default function EditorRoute() {
  const { draft } = useWritingSession();
  const [exit, setExit] = useState<'idle' | 'confirm' | 'approved'>('idle');
  usePreventRemove(Boolean(draft.body) && exit !== 'approved', () => setExit('confirm'));
  useEffect(() => {
    if (exit === 'approved') router.dismissTo('/');
  }, [exit]);
  return <EditorScreen
    onExit={() => exit === 'confirm' ? setExit('approved') : router.dismissTo('/')}
    exitRequested={exit === 'confirm'}
    onKeepEditing={() => setExit('idle')}
    onPreview={() => router.navigate('/write/preview')} />;
}
