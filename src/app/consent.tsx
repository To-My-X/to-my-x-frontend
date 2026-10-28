import { ConsentScreen } from "@/features/auth/ConsentScreen";
import { useSession } from "@/features/auth/auth-session";
import { resolveReturn } from "@/features/auth/return-target";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

// 08.06 필수 동의. 동의 전에 화면을 떠나면 로그인 자체를 취소합니다.
export default function ConsentRoute() {
  const { status, agree, cancelPending } = useSession();
  const { next } = useLocalSearchParams<{ next?: string }>();
  useEffect(() => () => cancelPending(), [cancelPending]);
  if (status === "restoring") return null;
  if (status === "ready") return <Redirect href={resolveReturn(next)} />;
  if (status !== "pending-consent") return <Redirect href="/login" />;
  return (
    <ConsentScreen
      onCancel={() => {
        cancelPending();
        router.dismissTo("/");
      }}
      onContinue={() => {
        agree();
        router.replace(resolveReturn(next));
      }}
    />
  );
}
