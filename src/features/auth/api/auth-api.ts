// To-My-X 인증 API 계약(/api/v1/auth). 공통 클라이언트가 ApiResponse 봉투를 해석합니다.
// node 테스트가 직접 로드하는 모듈이라 Metro 전용 @ 별칭 대신 상대 경로를 씁니다.
import { api } from "../../../lib/api.ts";

export { ApiError } from "../../../lib/api.ts";

export type LoginResult = {
  memberId: number;
  newMember: boolean;
  // true면 필수 약관 동의(08.06)가 필요합니다. 동의 전 토큰으로는 보호 기능을 쓸 수 없습니다.
  consentRequired: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  // 재발급 응답에도 포함됩니다(약관 개정으로 다시 동의가 필요한 경우 포함).
  consentRequired?: boolean;
};

// 카카오 로그인(웹): 인가 코드와 인가 요청에 쓴 redirect URI를 보냅니다. scope=openid가 필요합니다.
export const loginWithKakaoCode = (code: string, redirectUri: string) =>
  api<LoginResult>("/api/v1/auth/login/kakao/code", {
    method: "POST",
    body: { code, redirectUri },
  });

// 카카오 로그인(앱): 카카오 네이티브 SDK로 받은 ID 토큰을 보냅니다.
export const loginWithKakaoIdToken = (idToken: string, nonce?: string) =>
  api<LoginResult>("/api/v1/auth/login/kakao", {
    method: "POST",
    body: { idToken, nonce },
  });

// 리프레시 토큰을 회전해 새 토큰 쌍을 받습니다. 사용한 리프레시 토큰은 재사용할 수 없습니다.
export const refreshTokens = (refreshToken: string) =>
  api<TokenPair>("/api/v1/auth/token/refresh", {
    method: "POST",
    body: { refreshToken },
  });

// 리프레시 토큰 계열을 폐기합니다. 서버는 알 수 없는 토큰도 성공으로 응답합니다.
export const logoutServer = (refreshToken: string) =>
  api<void>("/api/v1/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
