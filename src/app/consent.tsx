import { ConsentScreen } from "@/features/auth/ConsentScreen";
import { useSession } from "@/features/auth/auth-session";
import { resolveReturn } from "@/features/auth/return-target";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";

// 08.06 필수 동의. 동의 전에 화면을 떠나면 로그인 자체를 취소합니다.
export default function ConsentRoute() {
  const { status, agree, cancelPending } = useSession();
  const { next } = useLocalSearchParams<{ next?: string }>();
  // 동의·취소로 끝난 뒤의 언마운트에서 세션을 지우지 않기 위한 플래그.
  // cancelPending은 렌더마다 바뀌므로 effect 의존성에 넣으면 상태 변경 때마다
  // 이전 클로저가 cleanup으로 실행돼 방금 성공한 세션을 초기화한다(2026-10-30 버그).
  const settled = useRef(false);
  const cancelRef = useRef(cancelPending);
  useEffect(() => {
    cancelRef.current = cancelPending;
  });
  useEffect(
    () => () => {
      if (!settled.current) cancelRef.current();
    },
    [],
  );
  if (status === "restoring") return null;
  if (status === "ready") return <Redirect href={resolveReturn(next)} />;
  if (status !== "pending-consent") return <Redirect href="/login" />;
  return (
    <ConsentScreen
      onCancel={() => {
        settled.current = true;
        cancelPending();
        router.dismissTo("/");
      }}
      onContinue={() => {
        settled.current = true;
        agree();
        router.replace(resolveReturn(next));
      }}
    />
  );
}
