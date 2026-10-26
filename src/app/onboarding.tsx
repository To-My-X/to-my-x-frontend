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
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";

// 미완료 진행은 저장된 장면을 복원하고, 없으면 세 에피소드를 균등 배정합니다.
// 화면에 뒤로 버튼은 없으며(시안 기준) 시스템 뒤로가 직전 장면을 복원하고,
// 첫 장면에서는 둘러보기 이력을 남긴 채 그대로 나갑니다.
export default function OnboardingRoute() {
  const { session } = useMockSession();
  const navigation = useNavigation();
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
  // beforeRemove 리스너에서 최신 값을 읽기 위한 동기 상태입니다.
  const live = useRef({ scene: initial.scene, finished: false });
  const record = (next: SceneId, done: boolean) => {
    if (!pinned) saveProgress({ episode: initial.episode, scene: next, done });
  };
  const show = (next: SceneId) => {
    live.current.scene = next;
    setScene(next);
    record(next, false);
  };
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (event) => {
        if (live.current.finished) return;
        const previous = history.current.pop();
        if (previous) {
          event.preventDefault();
          show(previous);
          return;
        }
        // 첫 장면에서 나가면 둘러보기 이력으로 남겨 재방문 시 피드로 들어갑니다.
        record(live.current.scene, true);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation],
  );
  return (
    <OnboardingScreen
      episode={initial.episode}
      scene={scene}
      onAdvance={(next) => {
        history.current.push(live.current.scene);
        show(next);
      }}
      onWrite={() => {
        live.current.finished = true;
        record(live.current.scene, true);
        if (session === "ready") router.push("/write");
        else router.push({ pathname: "/login", params: { next: "write" } });
      }}
    />
  );
}
