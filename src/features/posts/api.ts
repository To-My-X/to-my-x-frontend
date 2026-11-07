// 게시글 API(/api/v1/posts, /api/v1/me). 조회는 로그인 없이도 가능하지만
// 토큰이 있으면 서버가 숨김·차단·공감 상태를 반영하므로 항상 auth로 요청합니다.
// node 테스트가 직접 로드하는 모듈이라 Metro 전용 @ 별칭 대신 상대 경로를 씁니다.
import { api, ApiError } from "../../lib/api.ts";
import { clearHidden, loadHidden } from "./hidden-store.ts";
import type { CursorPage, PostView, ReportReason } from "./types.ts";

const page = (cursor: string | null, limit = 20) =>
  cursor ? `?cursor=${encodeURIComponent(cursor)}&limit=${limit}` : `?limit=${limit}`;

export const listFeed = (cursor: string | null) =>
  api<CursorPage<PostView>>(`/api/v1/posts${page(cursor)}`, { auth: true });

// 공유 링크 상세. 없거나 공개 중단이면 404 STORY4041(열람 불가)입니다.
export const getPost = (postId: string) =>
  api<PostView>(`/api/v1/posts/${postId}`, { auth: true });

export const listMyPosts = (cursor: string | null) =>
  api<CursorPage<PostView>>(`/api/v1/me/posts${page(cursor)}`, { auth: true });

// 내 글 상세. 공개 중단(SUSPENDED)도 조회됩니다.
export const getMyPost = (postId: string) =>
  api<PostView>(`/api/v1/me/posts/${postId}`, { auth: true });

export const createPost = (body: string, submissionId: string) =>
  api<PostView>("/api/v1/posts", {
    method: "POST",
    body: { body, submissionId },
    auth: true,
  });

export const getSubmission = (submissionId: string) =>
  api<{ status: "SUCCEEDED"; postId: string }>(
    `/api/v1/posts/submissions/${submissionId}`,
    { auth: true },
  );

// 등록 또는 재시도. 재시도는 기존 시도 결과를 먼저 확인하고,
// 미등록(404 STORY4042)이 확인된 경우에만 같은 submissionId로 다시 등록합니다.
export async function submitStory(
  body: string,
  submissionId: string,
  checkFirst: boolean,
): Promise<string> {
  if (checkFirst) {
    try {
      const existing = await getSubmission(submissionId);
      if (existing.status === "SUCCEEDED") return existing.postId;
    } catch (error) {
      if (!(error instanceof ApiError && error.code === "STORY4042")) throw error;
    }
  }
  const post = await createPost(body, submissionId);
  return post.id;
}

// 공감은 목표 최종 상태를 보냅니다. 연타·재시도해도 수는 한 번만 바뀝니다.
export const setReaction = (postId: string, reacted: boolean) =>
  api<{ reacted: boolean; reactionCount: number }>(
    `/api/v1/posts/${postId}/reaction`,
    { method: "PUT", body: { reacted }, auth: true },
  );

export const hidePostServer = (postId: string) =>
  api<void>(`/api/v1/me/hidden-posts/${postId}`, { method: "PUT", auth: true });

export const blockAuthor = (postId: string) =>
  api<void>(`/api/v1/posts/${postId}/block-author`, {
    method: "POST",
    auth: true,
  });

export const reportPost = (postId: string, reason: ReportReason) =>
  api<{ receiptId: string; alreadyReported: boolean }>(
    `/api/v1/posts/${postId}/reports`,
    { method: "POST", body: { reason }, auth: true },
  );

// 로그인 직후 한 번: 게스트 상태에서 숨긴 글을 계정 숨김에 합칩니다(합집합).
// 실패하면 로컬 목록을 유지해 다음 로그인에서 다시 합칩니다.
export async function mergeGuestHidden(): Promise<void> {
  const postIds = loadHidden();
  if (postIds.length === 0) return;
  try {
    await api<{ merged: number }>("/api/v1/me/hidden-posts", {
      method: "POST",
      body: { postIds },
      auth: true,
    });
    clearHidden();
  } catch {
    // 병합 실패는 치명적이지 않습니다. 로컬 필터는 계속 동작합니다.
  }
}
