import { router, useLocalSearchParams } from 'expo-router';
import { useMockSession } from '@/features/auth/mock-session';
import { MyScreen } from '@/features/my/MyScreen';
import { myStories } from '@/features/stories/mock-story';

export default function MyRoute() {
  const { session } = useMockSession();
  const { scenario } = useLocalSearchParams<{ scenario?: string }>();
  const stories = __DEV__ && scenario === 'empty' ? [] : myStories;
  return <MyScreen guest={session !== 'ready'} stories={stories}
    onBack={() => router.canGoBack() ? router.back() : router.replace('/')}
    onLogin={() => router.push({ pathname: '/login', params: { next: 'my' } })}
    onOpen={id => router.push(`/stories/${id}`)}
    onSettings={() => router.push('/settings')}
    onStories={() => router.canGoBack() ? router.dismissTo('/') : router.replace('/')} />;
}
