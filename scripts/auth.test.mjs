import assert from "node:assert/strict";
import { test } from "node:test";

const api = await import("../src/features/auth/api/auth-api.ts");
const kakao = await import("../src/features/auth/kakao.ts");

function mockFetch(handler) {
  globalThis.fetch = async (url, options) => handler(url, options);
}

test("api unwraps the ApiResponse envelope and sends the right body", async () => {
  let captured;
  mockFetch(async (url, options) => {
    captured = { url, body: JSON.parse(options.body) };
    return {
      ok: true,
      status: 200,
      json: async () => ({
        isSuccess: true,
        code: "OK",
        message: "",
        result: { accessToken: "a", refreshToken: "r" },
      }),
    };
  });
  const pair = await api.refreshTokens("old-token");
  assert.deepEqual(pair, { accessToken: "a", refreshToken: "r" });
  assert.ok(captured.url.endsWith("/api/v1/auth/token/refresh"));
  assert.deepEqual(captured.body, { refreshToken: "old-token" });
});

test("api errors carry the server code and message", async () => {
  mockFetch(async () => ({
    ok: false,
    status: 401,
    json: async () => ({
      isSuccess: false,
      code: "AUTH4011",
      message: "유효하지 않은 리프레시 토큰입니다.",
    }),
  }));
  await assert.rejects(api.refreshTokens("bad"), (error) => {
    assert.equal(error.code, "AUTH4011");
    assert.equal(error.status, 401);
    return true;
  });
  mockFetch(async () => {
    throw new TypeError("network down");
  });
  await assert.rejects(api.logoutServer("any"), (error) => {
    assert.equal(error.code, "NETWORK");
    return true;
  });
});

test("kakao authorize url keeps openid scope and verifiable state", () => {
  const storage = new Map();
  globalThis.sessionStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  };
  globalThis.location = { origin: "https://to-my-x.test", href: "" };
  const url = new URL(kakao.buildKakaoAuthorizeUrl("my"));
  assert.equal(url.origin + url.pathname, "https://kauth.kakao.com/oauth/authorize");
  assert.equal(url.searchParams.get("scope"), "openid");
  assert.equal(url.searchParams.get("response_type"), "code");
  assert.equal(url.searchParams.get("redirect_uri"), "https://to-my-x.test/login");
  const state = url.searchParams.get("state");
  assert.ok(state.endsWith(".my"));
  // 보관된 state와 일치하면 next 키를 복원하고, 일치하지 않으면 거부합니다.
  assert.deepEqual(kakao.consumeKakaoState(state), { valid: true, next: "my" });
  kakao.buildKakaoAuthorizeUrl(undefined);
  assert.equal(kakao.consumeKakaoState("forged.state").valid, false);
  assert.equal(kakao.consumeKakaoState(undefined).valid, false);
});
