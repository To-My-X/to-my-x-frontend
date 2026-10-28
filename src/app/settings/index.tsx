import { useSession } from "@/features/auth/auth-session";
import { SettingsScreen } from "@/features/settings/SettingsScreen";
import { Redirect, router } from "expo-router";

export default function SettingsRoute() {
  const { status, logout } = useSession();
  if (status === "restoring") return null;
  if (status !== "ready")
    return (
      <Redirect href={{ pathname: "/login", params: { next: "settings" } }} />
    );
  return (
    <SettingsScreen
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
