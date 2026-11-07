import assert from "node:assert/strict";
import { test } from "node:test";

// Node 내장 localStorage는 백업 파일 없이는 동작하지 않으므로 명시적으로 제거하고 시작합니다.
Object.defineProperty(globalThis, "localStorage", {
  value: undefined,
  configurable: true,
  writable: true,
});

const lib = await import("../src/lib/api.ts");
const posts = await import("../src/features/posts/api.ts");
const hidden = await import("../src/features/posts/hidden-store.ts");
const intent = await import("../src/features/posts/pending-intent.ts");
const feedApi = await import("../src/features/feed/api/feed-api.ts");

const envelope = (result) => ({
  ok: true,
  status: 200,
  json: async () => ({ isSuccess: true, code: "OK", message: "", result }),
});
const failure = (status, code, message, result) => ({
  ok: false,
  status,
  json: async () => ({ isSuccess: false, code, message, result }),
});

test("게시글 ID 기준 배경 배정은 같은 글에 항상 같은 배경을 준다", () => {
  const first = feedApi.backgroundFor("abc123");
  assert.equal(feedApi.backgroundFor("abc123"), first);
  assert.ok(["window", "cafe"].includes(first));
  const story = feedApi.toStory({
    id: "p1",
    body: "본문",
    summary: "요약",
    publishedAt: "2026-11-07T00:00:00Z",
    visibility: "PUBLIC",
    isMine: false,
    shareUrl: "https://to-my-x.expo.app/stories/p1",
    reactionCount: 3,
    reacted: true,
  });
  assert.equal(story.title, "요약");
  assert.equal(story.reactionCount, 3);
  assert.equal(story.reacted, true);
});

test("게스트 숨김 저장은 중복 없이 쌓이고 손상값을 무시한다", () => {
  hidden.clearHidden();
  hidden.addHidden("a");
  hidden.addHidden("b");
  hidden.addHidden("a");
  assert.deepEqual(hidden.loadHidden(), ["a", "b"]);
  const storage = new Map([["tomyx.hidden.v1", "{broken"]]);
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  };
  assert.deepEqual(hidden.loadHidden(), ["a", "b"]); // 손상 시 메모리 값 유지
  hidden.clearHidden();
  assert.deepEqual(hidden.loadHidden(), []);
  globalThis.localStorage = undefined;
});

test("복귀 의도는 한 번만 소비되고 위조값은 거부한다", () => {
  const storage = new Map();
  globalThis.sessionStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  };
  intent.setPendingIntent({ type: "reaction", postId: "p9" });
  assert.deepEqual(intent.consumePendingIntent(), {
    type: "reaction",
    postId: "p9",
  });
  assert.equal(intent.consumePendingIntent(), null);
  storage.set("tomyx.intent.v1", JSON.stringify({ type: "evil", postId: 1 }));
  assert.equal(intent.consumePendingIntent(), null);
});

test("등록 재시도는 기존 결과를 먼저 확인하고 미등록일 때만 같은 ID로 다시 등록한다", async () => {
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), method: options.method ?? "GET" });
    if (String(url).includes("/submissions/")) {
      return calls.length === 1
        ? failure(404, "STORY4042", "등록되지 않았습니다.")
        : envelope({ status: "SUCCEEDED", postId: "exists" });
    }
    return envelope({ id: "created", body: "b", summary: "b" });
  };
  // 1) 미등록 확인(404) → 같은 ID로 등록
  const first = await posts.submitStory("본문", "sub-1", true);
  assert.equal(first, "created");
  assert.ok(calls[0].url.includes("/submissions/sub-1"));
  assert.equal(calls[1].method, "POST");
  // 2) 이미 성공한 시도는 기존 postId를 그대로 쓰고 재등록하지 않는다
  const before = calls.length;
  const second = await posts.submitStory("본문", "sub-1", true);
  assert.equal(second, "exists");
  assert.equal(calls.length, before + 1);
});

test("공통 클라이언트는 401에서 재발급 후 1회 재시도하고 429의 retryAfter를 전달한다", async () => {
  let refreshed = 0;
  lib.registerAuthHooks({
    getAccessToken: () => "old",
    refreshAccessToken: async () => {
      refreshed += 1;
      return "new";
    },
    onConsentRequired: () => {},
  });
  const seen = [];
  globalThis.fetch = async (url, options = {}) => {
    seen.push(options.headers?.Authorization);
    if (seen.length === 1) return failure(401, "COMMON401", "만료");
    return envelope({ ok: true });
  };
  const result = await lib.api("/api/v1/me/settings", { auth: true });
  assert.deepEqual(result, { ok: true });
  assert.equal(refreshed, 1);
  assert.deepEqual(seen, ["Bearer old", "Bearer new"]);
  // 429는 result.retryAfter를 ApiError로 옮긴다
  globalThis.fetch = async () =>
    failure(429, "STORY4291", "너무 자주 등록했습니다.", { retryAfter: 42 });
  await assert.rejects(
    lib.api("/api/v1/posts", { method: "POST", body: {}, auth: true }),
    (error) => {
      assert.equal(error.retryAfter, 42);
      assert.equal(error.status, 429);
      return true;
    },
  );
});
