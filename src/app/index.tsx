import { useSession } from "@/features/auth/auth-session";
import { createFeedLoader } from "@/features/feed/api/feed-api";
import { createMockFeed } from "@/features/feed/api/mock-feed";
import { FeedScreen } from "@/features/feed/FeedScreen";
import { useFeed } from "@/features/feed/hooks/use-feed";
import { scenarios, type FeedScenario, type Story } from "@/features/feed/types";
import { getUnreadCount } from "@/features/notifications/api";
import { loadProgress } from "@/features/onboarding/progress";
import {
  blockAuthor,
  hidePostServer,
  reportPost,
  setReaction,
} from "@/features/posts/api";
import { subscribeFeedInvalidation } from "@/features/posts/feed-refresh";
import { addHidden } from "@/features/posts/hidden-store";
import {
  consumePendingIntent,
  setPendingIntent,
} from "@/features/posts/pending-intent";
import { StorySheets, type SheetMode } from "@/features/stories/StorySheets";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";

export default function FeedRoute() {
  const { status } = useSession();
  const ready = status === "ready";
  const { scenario: parameter } = useLocalSearchParams<{ scenario?: string }>();
  const [sheet, setSheet] = useState<{
    storyId: string;
    shareUrl?: string;
    mode: SheetMode;
  } | null>(null);
  // 개발 전용 검수 시나리오는 mock fixture를 유지하고, 그 외에는 실제 피드를 조회합니다.
  const mockScenario: FeedScenario | null =
    __DEV__ && scenarios.includes(parameter as FeedScenario)
      ? (parameter as FeedScenario)
      : null;
  const loader = useMemo(
    () =>
      mockScenario
        ? createMockFeed(mockScenario)
        : // 게스트는 로컬 숨김을 직접 거르고, 로그인 상태가 바뀌면 서버 필터 기준으로 다시 조회합니다.
          createFeedLoader(!ready),
    [mockScenario, ready],
  );
  const feed = useFeed(loader);
  const reloadRef = useRef(feed.reload);
  useEffect(() => {
    reloadRef.current = feed.reload;
  });
  // 등록 성공 등 외부 변경의 피드 무효화 알림을 구독합니다.
  useEffect(() => subscribeFeedInvalidation(() => reloadRef.current()), []);

  // 벨의 점은 서버 unreadCount > 0일 때만 표시합니다(게스트는 개인 API 호출 금지).
  const [bellDot, setBellDot] = useState(false);
  useEffect(() => {
    if (!ready) return;
    let active = true;
    getUnreadCount()
      .then((count) => {
        if (active) setBellDot(count > 0);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [ready]);

  // 게스트가 공감·신고·차단을 누르고 로그인한 뒤의 1회성 복귀 의도를 처리합니다.
  const intentHandled = useRef(false);
  useEffect(() => {
    if (!ready || intentHandled.current) return;
    intentHandled.current = true;
    queueMicrotask(() => {
      const intent = consumePendingIntent();
      if (!intent) return;
      if (intent.type === "reaction") {
        // 원래 누른 글에 목표 상태(공감)를 1회 적용합니다. 재조회 목록에도 서버 상태로 반영됩니다.
        setReaction(intent.postId, true)
          .then((result) =>
            feed.updateItem(intent.postId, {
              reacted: result.reacted,
              reactionCount: result.reactionCount,
            }),
          )
          .catch(() => {});
      } else {
        // 신고·차단은 자동 접수하지 않고 해당 시트를 다시 열기만 합니다.
        setSheet({ storyId: intent.postId, mode: intent.type });
      }
    });
  }, [ready, feed]);

  const reacting = useRef(new Set<string>());
  const onReact = (story: Story) => {
    if (!ready) {
      setPendingIntent({ type: "reaction", postId: story.id });
      router.push({ pathname: "/login", params: { next: "feed" } });
      return;
    }
    if (reacting.current.has(story.id)) return;
    reacting.current.add(story.id);
    // 목표 최종 상태를 요청 시작 시 고정합니다. 성공 결과만 반영하고 실패는 기존 값을 유지합니다.
    setReaction(story.id, !story.reacted)
      .then((result) =>
        feed.updateItem(story.id, {
          reacted: result.reacted,
          reactionCount: result.reactionCount,
        }),
      )
      .catch(() => {})
      .finally(() => {
        reacting.current.delete(story.id);
      });
  };

  // 첫 방문(이력 없음)과 미완료 진행은 시뮬레이션으로 보냅니다. 개발용 시나리오 검수는 예외입니다.
  const [progress] = useState(() => loadProgress());
  if (!progress?.done && !(__DEV__ && parameter))
    return <Redirect href="/onboarding" />;
  return (
    <>
      <FeedScreen
        key={mockScenario ?? "live"}
        feed={feed}
        bellDot={ready && bellDot}
        onBell={() => router.push("/notifications")}
        onReact={onReact}
        onShare={(story) =>
          setSheet({ storyId: story.id, shareUrl: story.shareUrl, mode: "share" })
        }
        onMore={(story) =>
          setSheet({ storyId: story.id, shareUrl: story.shareUrl, mode: "manage" })
        }
      />
      {sheet && (
        <StorySheets
          storyId={sheet.storyId}
          shareUrl={sheet.shareUrl}
          mode={sheet.mode}
          guest={!ready}
          onRequireLogin={(intent) => {
            // 로그인 후 같은 글의 신고·차단 시트로 복귀합니다(자동 접수 금지).
            setPendingIntent({ type: intent, postId: sheet.storyId });
            setSheet(null);
            router.push({ pathname: "/login", params: { next: "feed" } });
          }}
          actions={{
            hide: async () => {
              if (ready) await hidePostServer(sheet.storyId);
              else addHidden(sheet.storyId);
              feed.removeItem(sheet.storyId);
            },
            report: (reason) => reportPost(sheet.storyId, reason),
            block: async () => {
              await blockAuthor(sheet.storyId);
              // 차단한 작성자의 모든 글 제외는 서버 필터 기준으로 다시 조회해 반영합니다.
              feed.reload();
            },
          }}
          onChange={(mode) => setSheet({ ...sheet, mode })}
          onClose={() => setSheet(null)}
        />
      )}
    </>
  );
}
