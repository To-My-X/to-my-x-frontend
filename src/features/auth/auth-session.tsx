import { registerAuthHooks } from "@/lib/api";
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
  loginWithKakaoIdToken as loginWithKakaoIdTokenApi,
  logoutServer,
  refreshTokens,
  type LoginResult,
} from "./api/auth-api";
import { postConsents } from "./api/legal-api";
import { clearSession, loadSession, saveSession } from "./session-store";

// restoring: 앱 시작 시 저장된 리프레시 토큰으로 세션을 되살리는 중입니다.
// pending-consent: 로그인은 됐지만 필수 동의 확인 전입니다(08.06). 약관 개정 시 서버가 다시 요구할 수 있습니다.
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
  loginWithKakaoIdToken: (idToken: string, nonce?: string) => Promise<void>;
  mockLogin: () => void;
  // 필수 동의 저장(서버) 후 토큰을 재발급해 보호 기능 권한을 받습니다.
  agree: (termsVersion: string, privacyVersion: string) => Promise<void>;
  cancelPending: () => void;
  logout: () => Promise<void>;
};

const Context = createContext<Session | null>(null);

export function AuthProvider({
  children,
  onAuthenticated,
}: PropsWithChildren<{
  // 로그인·복원이 완료돼 보호 기능을 쓸 수 있게 된 직후 1회 호출됩니다(게스트 숨김 병합 등).
  onAuthenticated?: () => void;
}>) {
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
  const memberRef = useRef<number | null>(null);
  const mock = useRef(false);
  const authenticatedRef = useRef(onAuthenticated);
  useEffect(() => {
    authenticatedRef.current = onAuthenticated;
  });

  const reset = useCallback(() => {
    const refresh = tokens.current.refresh;
    tokens.current = { access: null, refresh: null };
    memberRef.current = null;
    mock.current = false;
    clearSession();
    setMemberId(null);
    setStatus("guest");
    // 서버는 알 수 없는 토큰도 성공으로 처리하므로 실패해도 로컬 정리를 유지합니다.
    if (refresh) logoutServer(refresh).catch(() => {});
  }, []);

  // 공통 클라이언트의 401 처리에서 쓰는 단일 재발급. 동시에 여러 요청이 401을
  // 받아도 재발급은 한 번만 수행합니다. 실패하면 게스트로 정리하고 null을 돌려줍니다.
  const refreshing = useRef<Promise<string | null> | null>(null);
  const refreshAccessToken = useCallback((): Promise<string | null> => {
    if (refreshing.current) return refreshing.current;
    const refresh = tokens.current.refresh;
    if (!refresh) return Promise.resolve(null);
    refreshing.current = refreshTokens(refresh)
      .then((pair) => {
        tokens.current = {
          access: pair.accessToken,
          refresh: pair.refreshToken,
        };
        if (memberRef.current !== null)
          saveSession({
            refreshToken: pair.refreshToken,
            memberId: memberRef.current,
            consented: pair.consentRequired !== true,
          });
        return pair.accessToken;
      })
      .catch(() => {
        reset();
        return null;
      })
      .finally(() => {
        refreshing.current = null;
      });
    return refreshing.current;
  }, [reset]);

  useEffect(() => {
    registerAuthHooks({
      getAccessToken: () => tokens.current.access,
      refreshAccessToken,
      // 어디서든 403 AUTH4032(동의 필요)가 오면 동의 화면으로 보낼 수 있게 상태를 바꿉니다.
      onConsentRequired: () =>
        setStatus((current) =>
          current === "ready" ? "pending-consent" : current,
        ),
    });
  }, [refreshAccessToken]);

  useEffect(() => {
    if (!stored) return;
    let active = true;
    // 리프레시 토큰을 회전해 세션을 복원합니다. 실패하면 게스트로 시작합니다.
    refreshTokens(stored.refreshToken)
      .then((pair) => {
        if (!active) return;
        tokens.current = {
          access: pair.accessToken,
          refresh: pair.refreshToken,
        };
        memberRef.current = stored.memberId;
        const needsConsent = pair.consentRequired === true;
        saveSession({
          refreshToken: pair.refreshToken,
          memberId: stored.memberId,
          consented: !needsConsent,
        });
        setMemberId(stored.memberId);
        setStatus(needsConsent ? "pending-consent" : "ready");
        if (!needsConsent) authenticatedRef.current?.();
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
    memberRef.current = result.memberId;
    mock.current = false;
    // 필수 동의(08.06) 필요 여부는 서버 응답이 결정합니다(최초 가입·약관 개정 포함).
    const needsConsent = result.consentRequired;
    saveSession({
      refreshToken: result.refreshToken,
      memberId: result.memberId,
      consented: !needsConsent,
    });
    setMemberId(result.memberId);
    setStatus(needsConsent ? "pending-consent" : "ready");
    if (!needsConsent) authenticatedRef.current?.();
  }, []);

  const loginWithKakaoCode = useCallback(
    async (code: string, redirectUri: string) => {
      apply(await loginWithKakaoCodeApi(code, redirectUri));
    },
    [apply],
  );

  const loginWithKakaoIdToken = useCallback(
    async (idToken: string, nonce?: string) => {
      apply(await loginWithKakaoIdTokenApi(idToken, nonce));
    },
    [apply],
  );

  const agree = useCallback(
    async (termsVersion: string, privacyVersion: string) => {
      if (mock.current) {
        // mock 세션은 서버 호출 없이 화면 연결만 확인합니다.
        setStatus("ready");
        return;
      }
      await postConsents(termsVersion, privacyVersion);
      // 동의 저장 후 토큰을 재발급해야 보호 기능 권한이 담긴 토큰을 받습니다.
      const renewed = await refreshAccessToken();
      if (!renewed) throw new Error("token refresh failed after consent");
      setStatus("ready");
      authenticatedRef.current?.();
    },
    [refreshAccessToken],
  );

  return (
    <Context.Provider
      value={{
        status,
        memberId,
        loginWithKakaoCode,
        loginWithKakaoIdToken,
        mockLogin: () => {
          if (!mockAuthEnabled) return;
          mock.current = true;
          setStatus("pending-consent");
        },
        agree,
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
