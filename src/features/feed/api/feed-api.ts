// 공개 피드 조회를 화면 모델(Story)로 변환합니다. 게시글 계약 원본은 features/posts가 소유합니다.
// node 테스트가 직접 로드하는 모듈이라 Metro 전용 @ 별칭 대신 상대 경로를 씁니다.
import { listFeed } from "../../posts/api.ts";
import { loadHidden } from "../../posts/hidden-store.ts";
import type { PostView } from "../../posts/types.ts";
import type { FeedPage, Story } from "../types.ts";

// 서버 글에는 배경 필드가 없어 글 ID로 두 배경을 고정 배정합니다. 같은 글은 항상 같은 배경입니다.
export function backgroundFor(id: string): Story["background"] {
  let sum = 0;
  for (const char of id) sum += char.codePointAt(0) ?? 0;
  return sum % 2 === 0 ? "window" : "cafe";
}

export const toStory = (post: PostView): Story => ({
  id: post.id,
  title: post.summary,
  body: post.body,
  background: backgroundFor(post.id),
  reactionCount: post.reactionCount,
  reacted: post.reacted,
  isMine: post.isMine,
  shareUrl: post.shareUrl,
});

// guestFilter: 게스트의 로컬 숨김을 걸러냅니다. 로그인 사용자는 서버가 숨김·차단을 반영합니다.
export function createFeedLoader(guestFilter: boolean) {
  return async (cursor: string | null): Promise<FeedPage> => {
    const page = await listFeed(cursor);
    const hidden = guestFilter ? new Set(loadHidden()) : null;
    return {
      items: page.items
        .filter((post) => !hidden?.has(post.id))
        .map(toStory),
      next: page.hasMore ? page.nextCursor : null,
    };
  };
}
