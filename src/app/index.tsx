import { useLocalSearchParams } from 'expo-router';
import { FeedScreen } from '@/features/feed/FeedScreen';
import { scenarios, type FeedScenario } from '@/features/feed/types';
export default function FeedRoute() {
  const { scenario: parameter } = useLocalSearchParams<{ scenario?: string }>();
  const scenario: FeedScenario = __DEV__ && scenarios.includes(parameter as FeedScenario) ? parameter as FeedScenario : 'normal';
  return <FeedScreen key={scenario} scenario={scenario} />;
}
