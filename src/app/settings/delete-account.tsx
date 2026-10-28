import { useSession } from "@/features/auth/auth-session";
import { DeleteAccountScreen } from "@/features/settings/DeleteAccountScreen";
import { Redirect, router } from "expo-router";

export default function DeleteAccountRoute() {
  const { status, logout } = useSession();
  if (status === "restoring") return null;
  if (status !== "ready")
    return (
      <Redirect href={{ pathname: "/login", params: { next: "settings" } }} />
    );
  return (
    <DeleteAccountScreen
      onBack={() =>
        router.canGoBack() ? router.back() : router.replace("/settings")
      }
      onFinish={() => {
        void logout();
        router.dismissTo("/");
      }}
    />
  );
}
