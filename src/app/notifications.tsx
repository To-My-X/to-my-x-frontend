import { useSession } from "@/features/auth/auth-session";
import {
  NotificationsScreen,
  type NotificationItem,
} from "@/features/notifications/NotificationsScreen";
import { router, useLocalSearchParams } from "expo-router";

const mockItems: NotificationItem[] = [
  { id: "n-1", title: "이야기가 남겨졌어요", time: "방금 전" },
  { id: "n-2", title: "To My X에 오신 걸 환영해요", time: "오늘" },
];

export default function NotificationsRoute() {
  const { status } = useSession();
  const { scenario } = useLocalSearchParams<{ scenario?: string }>();
  const items = __DEV__ && scenario === "empty" ? [] : mockItems;
  return (
    <NotificationsScreen
      guest={status !== "ready"}
      items={items}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      onLogin={() =>
        router.push({ pathname: "/login", params: { next: "notifications" } })
      }
    />
  );
}
