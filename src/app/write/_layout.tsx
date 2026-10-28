import { useSession } from "@/features/auth/auth-session";
import { Redirect, Stack } from "expo-router";
export default function WritingLayout() {
  const { status } = useSession();
  if (status === "restoring") return null;
  if (status !== "ready") return <Redirect href="/login" />;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: "slide_from_right",
      }}
    />
  );
}
