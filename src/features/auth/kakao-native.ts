import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login } from "@react-native-kakao/user";

// 네이티브(iOS·Android) 카카오 로그인. SDK가 카카오톡 앱 또는 계정 로그인으로 ID 토큰을 발급합니다.
// 웹 번들에는 kakao-native.web.ts 스텁이 대신 포함됩니다.
const nativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
let initialized = false;

export const kakaoNativeReady = () => Boolean(nativeAppKey);

export async function kakaoNativeLogin(): Promise<{
  idToken: string;
  nonce: string;
}> {
  if (!nativeAppKey) throw new Error("kakao native app key missing");
  if (!initialized) {
    await initializeKakaoSDK(nativeAppKey);
    initialized = true;
  }
  // 서버가 nonce를 검증할 수 있도록 ID 토큰 요청에 난수를 넣어 함께 보냅니다.
  const nonce = Math.random().toString(36).slice(2, 14);
  const token = await login({ nonce });
  if (!token.idToken)
    throw new Error(
      "kakao login returned no id token (check OpenID Connect activation)",
    );
  return { idToken: token.idToken, nonce };
}

// 사용자가 로그인 창을 닫은 경우는 실패가 아니라 취소로 처리합니다.
export const isKakaoCancel = (error: unknown) =>
  error instanceof Error && /cancel/i.test(error.message);
