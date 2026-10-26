import { useMockSession } from "@/features/auth/mock-session";
import { episodeIds, type EpisodeId, type SceneId } from "@/features/onboarding/episodes";
import { OnboardingScreen } from "@/features/onboarding/OnboardingScreen";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";

// 진행 저장·복원과 첫 방문 자동 배정은 미구현입니다. 장면 전이만 연결합니다.
export default function OnboardingRoute() {
  const { session } = useMockSession();
  // 검수용: 개발 환경에서 ?episode=kakao|insta|jani로 에피소드를 고정할 수 있습니다.
  const { episode: parameter } = useLocalSearchParams<{ episode?: string }>();
  const [episode] = useState<EpisodeId>(() =>
    __DEV__ && episodeIds.includes(parameter as EpisodeId)
      ? (parameter as EpisodeId)
      : episodeIds[Math.floor(Math.random() * episodeIds.length)],
  );
  const [scene, setScene] = useState<SceneId>("enter");
  const history = useRef<SceneId[]>([]);
  return (
    <OnboardingScreen
      episode={episode}
      scene={scene}
      onAdvance={(next) => {
        history.current.push(scene);
        setScene(next);
      }}
      onWrite={() =>
        session === "ready"
          ? router.push("/write")
          : router.push({ pathname: "/login", params: { next: "write" } })
      }
      onBack={() => {
        const previous = history.current.pop();
        if (previous) setScene(previous);
        else if (router.canGoBack()) router.back();
        else router.replace("/");
      }}
    />
  );
}
