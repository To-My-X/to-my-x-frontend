import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StoryDetailScreen } from '@/features/stories/StoryDetailScreen';
import { StorySheets, type SheetMode } from '@/features/stories/StorySheets';
import { findMockStory } from '@/features/stories/mock-story';

export default function StoryRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sheet, setSheet] = useState<SheetMode | null>(null);
  const story = findMockStory(id ?? '');
  return <>
    <StoryDetailScreen story={story}
      onBack={() => router.canGoBack() ? router.back() : router.replace('/')}
      onShare={() => setSheet('share')}
      onExplore={() => router.canGoBack() ? router.dismissTo('/') : router.replace('/')} />
    {sheet && <StorySheets storyId={id ?? ''} mode={sheet} onChange={setSheet} onClose={() => setSheet(null)} />}
  </>;
}
