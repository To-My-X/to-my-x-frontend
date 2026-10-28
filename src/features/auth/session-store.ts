// 로그인 세션 보존. 웹은 localStorage, localStorage가 없는 환경(네이티브)은 앱 실행 동안만
// 메모리에 보존합니다. 네이티브 보안 저장(expo-secure-store)은 저장 정책 확정 후 도입합니다.
export type StoredSession = {
  refreshToken: string;
  memberId: number;
  consented: boolean;
};

const key = "tomyx.auth.v1";
let memory: string | null = null;

type WebStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};
const local = (): WebStorage | null =>
  (globalThis as { localStorage?: WebStorage }).localStorage ?? null;

export function loadSession(): StoredSession | null {
  try {
    const raw = local()?.getItem(key) ?? memory;
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
    local()?.setItem(key, raw);
  } catch {
    // 저장 실패(사생활 보호 모드 등)는 로그인 진행을 막지 않습니다.
  }
}

export function clearSession() {
  memory = null;
  try {
    local()?.removeItem(key);
  } catch {
    // 정리 실패는 무시합니다.
  }
}
