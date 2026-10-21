import { Redirect } from 'expo-router';
import { FeedPreviewScreen } from '@/features/feed/FeedPreviewScreen';
export default function FeedPreviewRoute() {
  return __DEV__ ? <FeedPreviewScreen /> : <Redirect href="/" />;
}
