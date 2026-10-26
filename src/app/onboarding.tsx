import { useMockSession } from "@/features/auth/mock-session";
import {
  episodeIds,
  type EpisodeId,
  type SceneId,
} from "@/features/onboarding/episodes";
import { OnboardingScreen } from "@/features/onboarding/OnboardingScreen";
import {
  historyFor,
  loadProgress,
  saveProgress,
} from "@/features/onboarding/progress";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";

// 미완료 진행은 저장된 장면을 복원하고, 없으면 세 에피소드를 균등 배정합니다.
// 완료 기록(done)은 B·여운에서 작성 CTA를 누르거나 첫 장면에서 둘러보기로 이탈할 때 남깁니다.
export default function OnboardingRoute() {
  const { session } = useMockSession();
  // 검수용: 개발 환경에서 ?episode=kakao|insta|jani로 고정하면 저장을 읽지도 쓰지도 않습니다.
  const { episode: parameter } = useLocalSearchParams<{ episode?: string }>();
  const pinned = __DEV__ && episodeIds.includes(parameter as EpisodeId);
  const [initial] = useState(() => {
    if (pinned)
      return { episode: parameter as EpisodeId, scene: "enter" as SceneId };
    const saved = loadProgress();
    if (saved && !saved.done) return saved;
    const episode =
      saved?.episode ??
      episodeIds[Math.floor(Math.random() * episodeIds.length)];
    const assigned = { episode, scene: "enter" as SceneId, done: false };
    saveProgress(assigned);
    return assigned;
  });
  const [scene, setScene] = useState<SceneId>(initial.scene);
  const history = useRef<SceneId[]>(historyFor(initial.scene));
  const record = (next: SceneId, done: boolean) => {
    if (!pinned) saveProgress({ episode: initial.episode, scene: next, done });
  };
  return (
    <OnboardingScreen
      episode={initial.episode}
      scene={scene}
      onAdvance={(next) => {
        history.current.push(scene);
        setScene(next);
        record(next, false);
      }}
      onWrite={() => {
        record(scene, true);
        if (session === "ready") router.push("/write");
        else router.push({ pathname: "/login", params: { next: "write" } });
      }}
      onBack={() => {
        const previous = history.current.pop();
        if (previous) {
          setScene(previous);
          record(previous, false);
          return;
        }
        // 첫 장면에서 나가면 둘러보기 이력으로 남겨 재방문 시 피드로 들어갑니다.
        record(scene, true);
        if (router.canGoBack()) router.back();
        else router.replace("/");
      }}
    />
  );
}
