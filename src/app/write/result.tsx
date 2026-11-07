import { submitStory } from "@/features/posts/api";
import { invalidateFeed } from "@/features/posts/feed-refresh";
import { validBody } from "@/features/writing/body-rules";
import { ResultScreen } from "@/features/writing/ResultScreen";
import { useWritingSession } from "@/features/writing/writing-session";
import { Redirect, router } from "expo-router";
import { useState } from "react";

export default function ResultRoute() {
  const { clear, submission, setSubmission } = useWritingSession();
  // 제출 대상은 승인 시점의 시도(ID·본문)로 고정합니다. 화면 수명 동안 바뀌지 않습니다.
  const [target] = useState(submission);
  if (!target || !validBody(target.body)) return <Redirect href="/write" />;
  const finish = () => {
    // 성공 확정 후에만 초안·시도를 정리하고 피드를 무효화합니다.
    clear();
    setSubmission(null);
    invalidateFeed();
  };
  return (
    <ResultScreen
      submit={(checkFirst) => submitStory(target.body, target.id, checkFirst)}
      onDone={finish}
      onExplore={() => router.dismissTo("/")}
      onMyStory={(postId) => {
        // 완료의 뒤로가 제출 화면을 복원하지 않도록 스택을 정리하고 내 글 상세(06.03)로 이동합니다.
        router.dismissTo("/");
        router.push({
          pathname: "/stories/[id]",
          params: { id: postId, mine: "1" },
        });
      }}
      onEdit={() => router.dismissTo("/write")}
      onLogin={() =>
        router.push({ pathname: "/login", params: { next: "write" } })
      }
    />
  );
}
