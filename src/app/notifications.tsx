import { useSession } from "@/features/auth/auth-session";
import {
  listNotifications,
  markNotificationRead,
  type NotificationView,
} from "@/features/notifications/api";
import { NotificationsScreen } from "@/features/notifications/NotificationsScreen";
import { formatDateTime } from "@/lib/format";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

export default function NotificationsRoute() {
  const { status } = useSession();
  const ready = status === "ready";
  const [items, setItems] = useState<NotificationView[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const busy = useRef(false);
  const load = useCallback((after: string | null) => {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setError(false);
    listNotifications(after)
      .then((page) => {
        setItems((previous) =>
          after === null
            ? page.items
            : [
                ...previous,
                ...page.items.filter(
                  (item) => !previous.some((old) => old.id === item.id),
                ),
              ],
        );
        setCursor(page.nextCursor);
        setHasMore(page.hasMore);
      })
      .catch(() => setError(true))
      .finally(() => {
        busy.current = false;
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    if (ready) load(null);
  }, [ready, load]);
  const open = (id: string) => {
    const item = items.find((notification) => notification.id === id);
    if (!item) return;
    if (!item.readAt)
      // 읽음은 항목별로 저장하고 성공한 경우에만 목록에 반영합니다(실패 시 미읽음 유지).
      markNotificationRead(id)
        .then(() =>
          setItems((previous) =>
            previous.map((notification) =>
              notification.id === id
                ? { ...notification, readAt: new Date().toISOString() }
                : notification,
            ),
          ),
        )
        .catch(() => {});
    // 등록 완료 알림은 해당 내 글 상세(06.03)로 이동합니다. 환영 알림은 목록을 유지합니다.
    if (item.postId)
      router.push({
        pathname: "/stories/[id]",
        params: { id: item.postId, mine: "1" },
      });
  };
  return (
    <NotificationsScreen
      guest={!ready && status !== "restoring"}
      loading={loading || status === "restoring"}
      error={error}
      items={items.map((item) => ({
        id: item.id,
        title: item.message,
        time: formatDateTime(item.createdAt),
        unread: !item.readAt,
      }))}
      hasMore={hasMore}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      onLogin={() =>
        router.push({ pathname: "/login", params: { next: "notifications" } })
      }
      onRetry={() => load(items.length === 0 ? null : cursor)}
      onLoadMore={() => load(cursor)}
      onOpen={open}
    />
  );
}
