// 게시글 도메인 계약. 피드·상세·MY·글쓰기가 함께 쓰는 서버 모델의 소유 위치입니다.
// (frontend-architecture의 "공유 게시글 모델 소유 위치" 결정 — story-feed 스펙 2026-11-07 기록 참조)
export type PostView = {
  id: string; // 불투명 문자열. 숫자로 변환하면 값이 깨집니다.
  body: string;
  summary: string;
  publishedAt: string;
  visibility: "PUBLIC" | "SUSPENDED";
  isMine: boolean;
  shareUrl: string;
  reactionCount: number;
  reacted: boolean;
};

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type ReportReason = "PRIVACY" | "ABUSE" | "SPAM" | "OTHER";
