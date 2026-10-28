import { useSession } from "@/features/auth/auth-session";
import {
  buildKakaoAuthorizeUrl,
  consumeKakaoState,
  kakaoRedirectUri,
  kakaoWebReady,
} from "@/features/auth/kakao";
import { LoginScreen, type LoginPhase } from "@/features/auth/LoginScreen";
import { resolveReturn } from "@/features/auth/return-target";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

// 카카오 인가 콜백(code·state)도 이 라우트로 돌아옵니다. state의 next 키로 원래 화면에 복귀합니다.
export default function LoginRoute() {
  const { status, loginWithKakaoCode, mockLogin } = useSession();
  const { next, code, state, error } = useLocalSearchParams<{
    next?: string;
    code?: string;
    state?: string;
    error?: string;
  }>();
  const [phase, setPhase] = useState<LoginPhase>(
    code ? "busy" : error ? "failed" : "idle",
  );
  const [returnKey, setReturnKey] = useState<string | undefined>(next);
  const exchanged = useRef(false);
  useEffect(() => {
    if (!code || exchanged.current) return;
    exchanged.current = true;
    (async () => {
      const check = consumeKakaoState(state);
      if (check.next) setReturnKey(check.next);
      if (!check.valid) throw new Error("state mismatch");
      await loginWithKakaoCode(code, kakaoRedirectUri());
    })().catch(() => setPhase("failed"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, state]);
  if (status === "ready") return <Redirect href={resolveReturn(returnKey)} />;
  if (status === "pending-consent")
    return (
      <Redirect
        href={{
          pathname: "/consent",
          params: returnKey ? { next: returnKey } : {},
        }}
      />
    );
  const toKakao = () => {
    const web = globalThis as { location?: { href: string } };
    if (web.location) web.location.href = buildKakaoAuthorizeUrl(returnKey);
  };
  return (
    <LoginScreen
      phase={phase}
      kakaoEnabled={kakaoWebReady()}
      onKakao={toKakao}
      onCancel={() =>
        router.canGoBack() ? router.back() : router.replace("/")
      }
      onMockLogin={() => {
        mockLogin();
        router.replace({
          pathname: "/consent",
          params: returnKey ? { next: returnKey } : {},
        });
      }}
    />
  );
}
