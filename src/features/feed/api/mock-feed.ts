import type { FeedPage, FeedScenario, Story } from "../types";

// 개발 전용 검수 fixture. 실제 서버 커서와 같은 모양(string | null)을 사용합니다.
const stories: Omit<
  Story,
  "id" | "reactionCount" | "reacted" | "isMine"
>[] = [
  {
    title: "마지막 네 자리가\n기억나지 않더라.",
    body: "퇴근길에 우리가 듣던 노래가 나왔어.\n무심코 네 번호를 눌러봤는데,\n마지막 네 자리가 기억나지 않더라.\n나도 조금씩 잊고 있었나 봐.",
    metadata: "서울 연남동 · 헤어진 지 3개월",
    background: "window",
  },
  {
    title: "커피가 식을 때까지\n네 생각을 했어.",
    body: "늘 앉던 창가에 혼자 앉았어.\n두 잔을 주문할 뻔하다가 웃었지.\n이제는 내 취향으로 고른 커피가\n조금씩 익숙해지고 있어.",
    metadata: "비가 내리던 저녁",
    background: "cafe",
  },
  {
    title: "잘 지내라는 말은\n아직 연습 중이야.",
    body: "오늘은 돌아가는 길을 택했어.\n함께 걷던 골목에 꽃이 피었더라.\n언젠가는 아무렇지 않게\n그 길을 걸어갈 수 있겠지.",
    background: "window",
  },
];

export function createMockFeed(scenario: FeedScenario, delay = 550) {
  const failed = new Set<number>();
  return async (
    cursor: string | null,
    signal?: AbortSignal,
  ): Promise<FeedPage> => {
    const offset = cursor ? Number(cursor) : 0;
    await new Promise<void>((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const abort = () => {
        clearTimeout(timer);
        reject(new Error("aborted"));
      };
      if (signal?.aborted) {
        abort();
        return;
      }
      signal?.addEventListener("abort", abort, { once: true });
      if (scenario !== "loading")
        timer = setTimeout(() => {
          signal?.removeEventListener("abort", abort);
          resolve();
        }, delay);
    });
    if (
      ((scenario === "error" && offset === 0) ||
        (scenario === "pagination-error" && offset === 20)) &&
      !failed.has(offset)
    ) {
      failed.add(offset);
      throw new Error("mock request failed");
    }
    if (scenario === "empty") return { items: [], next: null };
    const items = Array.from(
      { length: Math.min(20, 60 - offset) },
      (_, index) => {
        const position = offset + index;
        const story = stories[position % stories.length];
        return {
          ...story,
          id: `mock-${position}`,
          reactionCount: position % 7,
          reacted: false,
          isMine: false,
          body:
            scenario === "long-text" && position === 0
              ? Array(12).fill(story.body).join("\n\n")
              : story.body,
        };
      },
    );
    const end = offset + items.length;
    return { items, next: end < 60 ? String(end) : null };
  };
}
