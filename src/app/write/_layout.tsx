import { useMockSession } from "@/features/auth/mock-session";
import { Redirect, Stack } from "expo-router";
export default function WritingLayout() {
  const { session } = useMockSession();
  if (session !== "ready") return <Redirect href="/login" />;
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
