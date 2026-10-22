import { FeedPreviewScreen } from "@/features/feed/FeedPreviewScreen";
import { Redirect } from "expo-router";
export default function FeedPreviewRoute() {
  return __DEV__ ? <FeedPreviewScreen /> : <Redirect href="/" />;
}
