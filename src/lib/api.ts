// To-My-X 공통 HTTP 클라이언트. 서버의 ApiResponse 봉투를 해석하고
// 인증 토큰 주입, 401 재발급 1회 후 재시도, 동의 필요(403 AUTH4032) 전파를 담당합니다.
// 기능 코드에 의존하지 않으며, 인증 동작은 auth 기능이 시작 시 등록합니다.
const baseUrl =
  process.env.EXPO_PUBLIC_API_URL ?? "https://api-tomyx.rhkr8521.com";

type Envelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  requestId?: string;
  result?: T;
};

export class ApiError extends Error {
  code: string;
  status: number;
  requestId?: string;
  // 서버가 도배 방지(429)에서 내려주는 재시도 가능 시각(초)
  retryAfter?: number;
  constructor(
    code: string,
    message: string,
    status: number,
    requestId?: string,
    retryAfter?: number,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.requestId = requestId;
    this.retryAfter = retryAfter;
  }
}

type AuthHooks = {
  getAccessToken: () => string | null;
  // 재발급 성공 시 새 access 토큰, 실패 시 null(세션은 게스트로 정리된 상태)
  refreshAccessToken: () => Promise<string | null>;
  // 어디서든 403 AUTH4032가 오면 필수 동의 화면으로 보내기 위한 알림
  onConsentRequired: () => void;
};
let hooks: AuthHooks | null = null;
export const registerAuthHooks = (next: AuthHooks) => {
  hooks = next;
};

// 서비스 계약: 15초 무응답은 읽기 오류·변경 결과 불명으로 구분합니다.
const timeoutMs = 15000;

export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = "GET", body, auth = false } = options;
  const run = async (token: string | null): Promise<Response> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch {
      throw new ApiError("NETWORK", "서버에 연결하지 못했습니다.", 0);
    } finally {
      clearTimeout(timer);
    }
  };
  let response = await run(auth ? (hooks?.getAccessToken() ?? null) : null);
  if (auth && response.status === 401 && hooks) {
    const renewed = await hooks.refreshAccessToken();
    if (renewed) response = await run(renewed);
  }
  let data: Envelope<T> | null = null;
  try {
    data = (await response.json()) as Envelope<T>;
  } catch {
    // 본문이 비었거나 JSON이 아니면 상태 코드로만 판단합니다.
  }
  if (!response.ok || !data?.isSuccess) {
    const code = data?.code ?? `HTTP${response.status}`;
    // 서버 기록과 대조할 수 있게 코드·requestId만 남깁니다. 토큰·본문은 기록하지 않습니다.
    console.warn("[api]", method, path, code, data?.requestId ?? "-");
    if (response.status === 403 && code === "AUTH4032")
      hooks?.onConsentRequired();
    const retryAfter = (data?.result as { retryAfter?: number } | undefined)
      ?.retryAfter;
    throw new ApiError(
      code,
      data?.message ?? "요청에 실패했습니다.",
      response.status,
      data?.requestId,
      retryAfter,
    );
  }
  return data.result as T;
}
