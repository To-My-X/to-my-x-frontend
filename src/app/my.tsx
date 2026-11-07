import { useSession } from "@/features/auth/auth-session";
import { MyScreen } from "@/features/my/MyScreen";
import { listMyPosts } from "@/features/posts/api";
import type { PostView } from "@/features/posts/types";
import { formatDate } from "@/lib/format";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

export default function MyRoute() {
  const { status } = useSession();
  const ready = status === "ready";
  const [items, setItems] = useState<PostView[]>([]);
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
    listMyPosts(after)
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
  return (
    <MyScreen
      guest={!ready && status !== "restoring"}
      loading={loading || status === "restoring"}
      error={error}
      stories={items.map((post) => ({
        id: post.id,
        summary: post.summary,
        postedAt: formatDate(post.publishedAt),
        suspended: post.visibility === "SUSPENDED",
      }))}
      hasMore={hasMore}
      onLogin={() =>
        router.push({ pathname: "/login", params: { next: "my" } })
      }
      onOpen={(id) =>
        router.push({ pathname: "/stories/[id]", params: { id, mine: "1" } })
      }
      onRetry={() => load(items.length === 0 ? null : cursor)}
      onLoadMore={() => load(cursor)}
      onSettings={() => router.push("/settings")}
    />
  );
}
