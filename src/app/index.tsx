import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useMockSession } from '@/features/auth/mock-session';
import { FeedScreen } from '@/features/feed/FeedScreen';
import { scenarios, type FeedScenario } from '@/features/feed/types';
import { StorySheets, type SheetMode } from '@/features/stories/StorySheets';

export default function FeedRoute() {
  const { session } = useMockSession();
  const { scenario: parameter } = useLocalSearchParams<{ scenario?: string }>();
  const [sheet, setSheet] = useState<{ storyId: string; mode: SheetMode } | null>(null);
  const scenario: FeedScenario = __DEV__ && scenarios.includes(parameter as FeedScenario) ? parameter as FeedScenario : 'normal';
  return <>
    <FeedScreen key={scenario} scenario={scenario}
      onWrite={() => router.push(session === 'ready' ? '/write' : '/login')}
      onBell={() => router.push('/notifications')}
      onMyTab={() => router.push('/my')}
      onShare={story => setSheet({ storyId: story.id, mode: 'share' })}
      onMore={story => session === 'ready' ? setSheet({ storyId: story.id, mode: 'manage' }) : router.push({ pathname: '/login', params: { next: 'feed' } })} />
    {sheet && <StorySheets storyId={sheet.storyId} mode={sheet.mode} onChange={mode => setSheet({ ...sheet, mode })} onClose={() => setSheet(null)} />}
  </>;
}
