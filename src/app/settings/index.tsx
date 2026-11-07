import { useSession } from "@/features/auth/auth-session";
import { getAccountSettings } from "@/features/settings/api";
import { SettingsScreen } from "@/features/settings/SettingsScreen";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";

const providerLabels = {
  KAKAO: "카카오 계정",
  GOOGLE: "Google 계정",
  APPLE: "Apple 계정",
} as const;

export default function SettingsRoute() {
  const { status, logout } = useSession();
  const ready = status === "ready";
  const [account, setAccount] = useState<string>();
  const [supportEmail, setSupportEmail] = useState<string>();
  useEffect(() => {
    if (!ready) return;
    let active = true;
    getAccountSettings()
      .then((settings) => {
        if (!active) return;
        setAccount(providerLabels[settings.provider] ?? settings.provider);
        // 서버에 문의 주소가 아직 없으면 빈 값이 옵니다.
        setSupportEmail(settings.supportEmail || "준비 중");
      })
      .catch(() => {
        // 조회 실패 시 자리 문구를 유지합니다. 메뉴 동작은 영향받지 않습니다.
      });
    return () => {
      active = false;
    };
  }, [ready]);
  if (status === "restoring") return null;
  if (!ready)
    return (
      <Redirect href={{ pathname: "/login", params: { next: "settings" } }} />
    );
  return (
    <SettingsScreen
      account={account}
      supportEmail={supportEmail}
      onBack={() =>
        router.canGoBack() ? router.back() : router.replace("/my")
      }
      onLegal={(kind) => router.push(`/legal/${kind}`)}
      onLogout={() => {
        void logout();
        router.dismissTo("/");
      }}
      onDeleteAccount={() => router.push("/settings/delete-account")}
    />
  );
}
