// To-My-X 인증 API 계약(/api/v1/auth). 응답은 공통 ApiResponse 봉투를 사용합니다.
const baseUrl =
  process.env.EXPO_PUBLIC_API_URL ?? "https://api-tomyx.rhkr8521.com";

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: T;
};

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("NETWORK", "서버에 연결하지 못했습니다.", 0);
  }
  let data: ApiResponse<T> | null = null;
  try {
    data = (await response.json()) as ApiResponse<T>;
  } catch {
    // 본문이 비었거나 JSON이 아니면 상태 코드로만 판단합니다.
  }
  if (!response.ok || !data?.isSuccess) {
    throw new ApiError(
      data?.code ?? `HTTP${response.status}`,
      data?.message ?? "요청에 실패했습니다.",
      response.status,
    );
  }
  return data.result as T;
}

export type LoginResult = {
  memberId: number;
  newMember: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TokenPair = { accessToken: string; refreshToken: string };

// 카카오 로그인(웹): 인가 코드와 인가 요청에 쓴 redirect URI를 보냅니다. scope=openid가 필요합니다.
export const loginWithKakaoCode = (code: string, redirectUri: string) =>
  post<LoginResult>("/api/v1/auth/login/kakao/code", { code, redirectUri });

// 카카오 로그인(앱): 카카오 네이티브 SDK로 받은 ID 토큰을 보냅니다.
export const loginWithKakaoIdToken = (idToken: string, nonce?: string) =>
  post<LoginResult>("/api/v1/auth/login/kakao", { idToken, nonce });

// 리프레시 토큰을 회전해 새 토큰 쌍을 받습니다. 사용한 리프레시 토큰은 재사용할 수 없습니다.
export const refreshTokens = (refreshToken: string) =>
  post<TokenPair>("/api/v1/auth/token/refresh", { refreshToken });

// 리프레시 토큰 계열을 폐기합니다. 서버는 알 수 없는 토큰도 성공으로 응답합니다.
export const logoutServer = (refreshToken: string) =>
  post<void>("/api/v1/auth/logout", { refreshToken });
