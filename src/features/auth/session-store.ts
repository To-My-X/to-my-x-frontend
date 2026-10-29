import * as SecureStore from "expo-secure-store";

// 로그인 세션 보존(네이티브). refresh 토큰은 자격 증명이라 기기 보안 저장소
// (iOS Keychain·Android Keystore)에 암호화 저장해 앱 재시작 후에도 로그인을 유지합니다.
// 웹 번들에는 session-store.web.ts(localStorage)가 대신 포함됩니다.
export type StoredSession = {
  refreshToken: string;
  memberId: number;
  consented: boolean;
};

const key = "tomyx.auth.v1";
// 보안 저장 실패(기기 잠금 상태 등) 시 앱 실행 동안만 유지하는 폴백입니다.
let memory: string | null = null;

export function loadSession(): StoredSession | null {
  try {
    const raw = SecureStore.getItem(key) ?? memory;
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<StoredSession>;
    if (typeof data.refreshToken !== "string" || !data.refreshToken)
      return null;
    if (typeof data.memberId !== "number") return null;
    return {
      refreshToken: data.refreshToken,
      memberId: data.memberId,
      consented: data.consented === true,
    };
  } catch {
    return null;
  }
}

export function saveSession(session: StoredSession) {
  const raw = JSON.stringify(session);
  memory = raw;
  try {
    SecureStore.setItem(key, raw);
  } catch {
    // 저장 실패는 로그인 진행을 막지 않습니다. 이번 실행 동안은 메모리로 유지됩니다.
  }
}

export function clearSession() {
  memory = null;
  SecureStore.deleteItemAsync(key).catch(() => {
    // 정리 실패는 무시합니다. 만료된 refresh 토큰은 서버에서 재사용되지 않습니다.
  });
}
