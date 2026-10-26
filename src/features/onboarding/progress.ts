import type { EpisodeId, SceneId } from "./episodes";

// episodes.ts와의 일치는 scripts/onboarding.test.mjs에서 전수 대조로 검증합니다.
const validEpisodes: readonly string[] = ["kakao", "insta", "jani"];
const validScenes: readonly string[] = ["enter", "choice", "actionA", "actionB", "afterglow"];

// 첫 방문 배정·진행 저장. 웹은 브라우저 localStorage에 보존하고,
// localStorage가 없는 환경(네이티브)은 앱 실행 동안만 메모리에 보존합니다.
// 네이티브 영구 저장 범위는 스펙 미결정(OPEN-05)이라 저장 모듈을 아직 추가하지 않습니다.
export type OnboardingProgress = {
  episode: EpisodeId;
  scene: SceneId;
  done: boolean;
};

const key = "tomyx.onboarding.v1";
let memory: string | null = null;

type WebStorage = { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void };
const local = (): WebStorage | null =>
  (globalThis as { localStorage?: WebStorage }).localStorage ?? null;

export function loadProgress(): OnboardingProgress | null {
  // 저장이 손상됐거나 읽을 수 없으면 이력이 없는 것으로 보고 새로 배정합니다.
  try {
    const raw = local()?.getItem(key) ?? memory;
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<OnboardingProgress>;
    if (!validEpisodes.includes(data.episode as string)) return null;
    if (!validScenes.includes(data.scene as string)) return null;
    return {
      episode: data.episode as EpisodeId,
      scene: data.scene as SceneId,
      done: data.done === true,
    };
  } catch {
    return null;
  }
}

export function saveProgress(progress: OnboardingProgress) {
  const raw = JSON.stringify(progress);
  memory = raw;
  try {
    local()?.setItem(key, raw);
  } catch {
    // 저장 실패(사생활 보호 모드 등)는 진행을 막지 않습니다. 메모리 보존만 유지합니다.
  }
}

// 복원된 장면에서 뒤로 갈 때 같은 에피소드의 직전 장면을 되살리기 위한 경로입니다.
export function historyFor(scene: SceneId): SceneId[] {
  if (scene === "choice") return ["enter"];
  if (scene === "actionA" || scene === "actionB") return ["enter", "choice"];
  if (scene === "afterglow") return ["enter", "choice", "actionA"];
  return [];
}
