export const scenarios = [
  "normal",
  "loading",
  "empty",
  "error",
  "pagination-error",
  "long-text",
] as const;
export type FeedScenario = (typeof scenarios)[number];
// 피드 카드 화면 모델. 제목은 서버 summary(본문 앞 20자 발췌)이고
// 배경은 서버에 필드가 없어 글 ID 기준으로 고정 배정합니다(2026-11-07 사용자 결정).
export type Story = {
  id: string;
  title: string;
  body: string;
  metadata?: string;
  background: "window" | "cafe";
  reactionCount: number;
  reacted: boolean;
  isMine: boolean;
  shareUrl?: string;
};
export type FeedPage = { items: Story[]; next: string | null };
