import { useMockSession } from "@/features/auth/mock-session";
import { FeedScreen } from "@/features/feed/FeedScreen";
import { scenarios, type FeedScenario } from "@/features/feed/types";
import { loadProgress } from "@/features/onboarding/progress";
import { StorySheets, type SheetMode } from "@/features/stories/StorySheets";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function FeedRoute() {
  const { session } = useMockSession();
  const { scenario: parameter } = useLocalSearchParams<{ scenario?: string }>();
  const [sheet, setSheet] = useState<{
    storyId: string;
    mode: SheetMode;
  } | null>(null);
  const scenario: FeedScenario =
    __DEV__ && scenarios.includes(parameter as FeedScenario)
      ? (parameter as FeedScenario)
      : "normal";
  // 첫 방문(이력 없음)과 미완료 진행은 시뮬레이션으로 보냅니다. 개발용 시나리오 검수는 예외입니다.
  const [progress] = useState(() => loadProgress());
  if (!progress?.done && !(__DEV__ && parameter))
    return <Redirect href="/onboarding" />;
  return (
    <>
      <FeedScreen
        key={scenario}
        scenario={scenario}
        onWrite={() => router.push(session === "ready" ? "/write" : "/login")}
        onBell={() => router.push("/notifications")}
        onMyTab={() => router.push("/my")}
        onShare={(story) => setSheet({ storyId: story.id, mode: "share" })}
        onMore={(story) =>
          session === "ready"
            ? setSheet({ storyId: story.id, mode: "manage" })
            : router.push({ pathname: "/login", params: { next: "feed" } })
        }
      />
      {sheet && (
        <StorySheets
          storyId={sheet.storyId}
          mode={sheet.mode}
          onChange={(mode) => setSheet({ ...sheet, mode })}
          onClose={() => setSheet(null)}
        />
      )}
    </>
  );
}
