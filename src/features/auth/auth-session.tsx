import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import {
  loginWithKakaoCode as loginWithKakaoCodeApi,
  logoutServer,
  refreshTokens,
  type LoginResult,
} from "./api/auth-api";
import { clearSession, loadSession, saveSession } from "./session-store";

// restoring: 앱 시작 시 저장된 리프레시 토큰으로 세션을 되살리는 중입니다.
// pending-consent: 로그인은 됐지만 필수 동의 확인 전입니다(08.06).
export type SessionStatus =
  | "restoring"
  | "guest"
  | "pending-consent"
  | "ready";

// 개발·내부 테스트 검수용 mock 로그인. EAS preview 환경에서만 플래그로 켜지고
// production 번들에는 포함되지 않습니다. mock 세션은 토큰 없이 화면 연결만 확인합니다.
export const mockAuthEnabled =
  __DEV__ || process.env.EXPO_PUBLIC_MOCK_AUTH === "1";

type Session = {
  status: SessionStatus;
  memberId: number | null;
  loginWithKakaoCode: (code: string, redirectUri: string) => Promise<void>;
  mockLogin: () => void;
  agree: () => void;
  cancelPending: () => void;
  logout: () => Promise<void>;
};

const Context = createContext<Session | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  // 저장된 세션이 없으면 복원 단계 없이 바로 게스트로 시작합니다.
  const [stored] = useState(() => loadSession());
  const [status, setStatus] = useState<SessionStatus>(
    stored ? "restoring" : "guest",
  );
  const [memberId, setMemberId] = useState<number | null>(null);
  // 토큰은 렌더와 무관한 자격 증명이라 ref로만 들고 다닙니다.
  const tokens = useRef<{ access: string | null; refresh: string | null }>({
    access: null,
    refresh: null,
  });
  const consented = useRef(false);

  useEffect(() => {
    if (!stored) return;
    let active = true;
    // 리프레시 토큰을 회전해 세션을 복원합니다. 실패하면 게스트로 시작합니다.
    refreshTokens(stored.refreshToken)
      .then((pair) => {
        if (!active) return;
        tokens.current = { access: pair.accessToken, refresh: pair.refreshToken };
        consented.current = stored.consented;
        saveSession({
          refreshToken: pair.refreshToken,
          memberId: stored.memberId,
          consented: stored.consented,
        });
        setMemberId(stored.memberId);
        setStatus(stored.consented ? "ready" : "pending-consent");
      })
      .catch(() => {
        if (!active) return;
        clearSession();
        setStatus("guest");
      });
    return () => {
      active = false;
    };
  }, [stored]);

  const apply = useCallback((result: LoginResult) => {
    tokens.current = {
      access: result.accessToken,
      refresh: result.refreshToken,
    };
    // 필수 동의(08.06)는 처음 가입했거나 이 기기에서 동의 기록이 없으면 다시 확인합니다.
    const needsConsent = result.newMember || !loadSession()?.consented;
    consented.current = !needsConsent;
    saveSession({
      refreshToken: result.refreshToken,
      memberId: result.memberId,
      consented: !needsConsent,
    });
    setMemberId(result.memberId);
    setStatus(needsConsent ? "pending-consent" : "ready");
  }, []);

  const loginWithKakaoCode = useCallback(
    async (code: string, redirectUri: string) => {
      apply(await loginWithKakaoCodeApi(code, redirectUri));
    },
    [apply],
  );

  const reset = useCallback(() => {
    const refresh = tokens.current.refresh;
    tokens.current = { access: null, refresh: null };
    consented.current = false;
    clearSession();
    setMemberId(null);
    setStatus("guest");
    // 서버는 알 수 없는 토큰도 성공으로 처리하므로 실패해도 로컬 정리를 유지합니다.
    if (refresh) logoutServer(refresh).catch(() => {});
  }, []);

  return (
    <Context.Provider
      value={{
        status,
        memberId,
        loginWithKakaoCode,
        mockLogin: () => {
          if (mockAuthEnabled) setStatus("pending-consent");
        },
        agree: () => {
          if (status !== "pending-consent") return;
          consented.current = true;
          const stored = loadSession();
          if (stored) saveSession({ ...stored, consented: true });
          setStatus("ready");
        },
        // 동의 전에 이탈하면 로그인 자체를 취소합니다(스펙: 동의 취소는 세션 정리).
        cancelPending: () => {
          if (status === "pending-consent") reset();
        },
        logout: async () => reset(),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useSession() {
  const value = useContext(Context);
  if (!value) throw new Error("AuthProvider is required");
  return value;
}
