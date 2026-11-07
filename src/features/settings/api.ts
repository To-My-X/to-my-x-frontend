// 설정·탈퇴 API(/api/v1/me/settings, /api/v1/me/withdrawal).
import { api } from "@/lib/api";

export type AccountSettings = {
  provider: "KAKAO" | "GOOGLE" | "APPLE";
  pushEnabled: boolean;
  pushCapability: "UNSUPPORTED";
  supportEmail: string;
};

export const getAccountSettings = () =>
  api<AccountSettings>("/api/v1/me/settings", { auth: true });

export type DeletionStatus = { status: "SUCCEEDED"; completedAt: string };

// 탈퇴. 같은 operationId 재요청은 같은 결과를 돌려줍니다(멱등).
export const requestWithdrawal = (operationId: string) =>
  api<DeletionStatus>("/api/v1/me/withdrawal", {
    method: "POST",
    body: { operationId },
    auth: true,
  });

// 탈퇴 응답을 받지 못했을 때 결과를 확인합니다. 404 ACCOUNT4041이면 탈퇴되지 않은 상태입니다.
export const getDeletionStatus = (operationId: string) =>
  api<DeletionStatus>(`/api/v1/account-deletions/${operationId}`);
