import { useSession } from "@/features/auth/auth-session";
import { DeleteAccountScreen } from "@/features/settings/DeleteAccountScreen";
import {
  getDeletionStatus,
  requestWithdrawal,
} from "@/features/settings/api";
import { ApiError } from "@/lib/api";
import { randomId } from "@/lib/ids";
import { Redirect, router } from "expo-router";
import { useRef } from "react";

export default function DeleteAccountRoute() {
  const { status, logout } = useSession();
  // 탈퇴 시도 ID는 첫 요청에서 만들고 재시도에도 같은 값을 씁니다(멱등).
  const operationId = useRef<string | null>(null);
  if (status === "restoring") return null;
  if (status !== "ready")
    return (
      <Redirect href={{ pathname: "/login", params: { next: "settings" } }} />
    );
  const withdraw = async () => {
    operationId.current ??= randomId();
    const id = operationId.current;
    try {
      await requestWithdrawal(id);
    } catch (error) {
      // 응답 유실(결과 불명)은 결과를 먼저 확인합니다. 404 ACCOUNT4041이면 탈퇴되지 않은 것입니다.
      if (error instanceof ApiError && error.code === "NETWORK") {
        await getDeletionStatus(id);
        return;
      }
      throw error;
    }
  };
  return (
    <DeleteAccountScreen
      onBack={() =>
        router.canGoBack() ? router.back() : router.replace("/settings")
      }
      withdraw={withdraw}
      onFinish={() => {
        // 서버 토큰은 이미 무효지만 로컬 세션·저장값을 정리합니다.
        void logout();
        router.dismissTo("/");
      }}
    />
  );
}
