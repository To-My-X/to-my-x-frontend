// 웹 번들용 스텁. 웹은 인가 코드 리다이렉트(kakao.ts)를 사용하므로 네이티브 SDK를 포함하지 않습니다.
export const kakaoNativeReady = () => false;

export async function kakaoNativeLogin(): Promise<{
  idToken: string;
  nonce: string;
}> {
  throw new Error("kakao native login is not available on web");
}

export const isKakaoCancel = () => false;
