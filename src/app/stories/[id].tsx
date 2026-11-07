import { ApiError } from "@/lib/api";
import { getMyPost, getPost } from "@/features/posts/api";
import type { PostView } from "@/features/posts/types";
import { StoryDetailScreen } from "@/features/stories/StoryDetailScreen";
import { StorySheets, type SheetMode } from "@/features/stories/StorySheets";
import { formatDate } from "@/lib/format";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

// 공유 링크 공개 상세와 내 글 상세(mine=1, 06.03)를 함께 처리합니다.
// 없거나 공개 중단·차단이면 서버가 404로 거부해 열람 불가(07.09)를 표시합니다.
export default function StoryRoute() {
  const { id, mine } = useLocalSearchParams<{ id: string; mine?: string }>();
  const [sheet, setSheet] = useState<SheetMode | null>(null);
  const [post, setPost] = useState<PostView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const load = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    setUnavailable(false);
    (mine === "1" ? getMyPost(id) : getPost(id))
      .then(setPost)
      .catch((cause) => {
        if (cause instanceof ApiError && cause.status === 404)
          setUnavailable(true);
        else setError(true);
      })
      .finally(() => setLoading(false));
  }, [id, mine]);
  useEffect(() => {
    queueMicrotask(load);
  }, [load]);
  return (
    <>
      <StoryDetailScreen
        story={
          post && !unavailable
            ? {
                id: post.id,
                title: post.summary,
                body: post.body,
                postedAt: formatDate(post.publishedAt),
                isMine: post.isMine,
                suspended: post.visibility === "SUSPENDED",
              }
            : null
        }
        loading={loading}
        error={error}
        onRetry={load}
        onBack={() =>
          router.canGoBack() ? router.back() : router.replace("/")
        }
        onShare={() => setSheet("share")}
        onExplore={() =>
          router.canGoBack() ? router.dismissTo("/") : router.replace("/")
        }
      />
      {sheet && (
        <StorySheets
          storyId={id ?? ""}
          shareUrl={post?.shareUrl}
          mode={sheet}
          onChange={setSheet}
          onClose={() => setSheet(null)}
        />
      )}
    </>
  );
}
