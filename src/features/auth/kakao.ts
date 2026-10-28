// 카카오 인가 코드 플로우(웹) 준비. 인가 요청에는 서버 명세대로 scope=openid를 포함합니다.
// 클라이언트 키와 redirect URI는 카카오 콘솔 등록값을 환경변수로 주입합니다.
export const kakaoClientId = process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID;

type WebGlobals = {
  location?: { origin: string; href: string };
  sessionStorage?: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
  };
};
const web = globalThis as WebGlobals;

export function kakaoRedirectUri() {
  return (
    process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI ??
    (web.location ? `${web.location.origin}/login` : "")
  );
}

// 웹 브라우저에서 카카오 인가 요청이 가능한 상태인지. 네이티브는 ID 토큰(SDK) 방식을 사용합니다.
export const kakaoWebReady = () =>
  Boolean(kakaoClientId && web.location && web.sessionStorage);

const stateKey = "tomyx.kakao.state";

// 인가 요청 URL을 만들고, 복귀 검증용 state(난수 + next 키)를 세션에 보관합니다.
export function buildKakaoAuthorizeUrl(next?: string) {
  const nonce = Math.random().toString(36).slice(2, 12);
  const state = `${nonce}.${next ?? ""}`;
  web.sessionStorage?.setItem(stateKey, state);
  const query = new URLSearchParams({
    client_id: kakaoClientId ?? "",
    redirect_uri: kakaoRedirectUri(),
    response_type: "code",
    scope: "openid",
    state,
  });
  return `https://kauth.kakao.com/oauth/authorize?${query.toString()}`;
}

// 콜백의 state를 보관값과 대조하고, 일치하면 next 키를 돌려줍니다. 불일치는 위조로 보고 거부합니다.
export function consumeKakaoState(state: string | undefined): {
  valid: boolean;
  next?: string;
} {
  const saved = web.sessionStorage?.getItem(stateKey) ?? null;
  web.sessionStorage?.removeItem(stateKey);
  if (!state || !saved || state !== saved) return { valid: false };
  const next = state.split(".").slice(1).join(".");
  return { valid: true, next: next || undefined };
}
