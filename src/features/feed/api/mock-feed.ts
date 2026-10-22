import type { FeedPage, FeedScenario, Story } from "../types";

const stories: Omit<Story, "id">[] = [
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
  return async (cursor: number, signal: AbortSignal): Promise<FeedPage> => {
    await new Promise<void>((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const abort = () => {
        clearTimeout(timer);
        reject(new Error("aborted"));
      };
      if (signal.aborted) {
        abort();
        return;
      }
      signal.addEventListener("abort", abort, { once: true });
      if (scenario !== "loading")
        timer = setTimeout(() => {
          signal.removeEventListener("abort", abort);
          resolve();
        }, delay);
    });
    if (
      ((scenario === "error" && cursor === 0) ||
        (scenario === "pagination-error" && cursor === 20)) &&
      !failed.has(cursor)
    ) {
      failed.add(cursor);
      throw new Error("mock request failed");
    }
    if (scenario === "empty") return { items: [], next: null };
    const items = Array.from(
      { length: Math.min(20, 60 - cursor) },
      (_, offset) => {
        const index = cursor + offset;
        const story = stories[index % stories.length];
        return {
          ...story,
          id: `mock-${index}`,
          body:
            scenario === "long-text" && index === 0
              ? Array(12).fill(story.body).join("\n\n")
              : story.body,
        };
      },
    );
    return {
      items,
      next: cursor + items.length < 60 ? cursor + items.length : null,
    };
  };
}
