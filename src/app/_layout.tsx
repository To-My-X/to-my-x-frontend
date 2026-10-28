import { AuthProvider } from "@/features/auth/auth-session";
import { WritingSessionProvider } from "@/features/writing/writing-session";
import "@/global.css";
import { tokens } from "@/theme/tokens";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

void SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, error] = useFonts({
    MaruBuri: require("@/assets/fonts/MaruBuri-Regular.ttf"),
    Pretendard: require("@/assets/fonts/Pretendard-Regular.otf"),
  });
  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <AuthProvider>
      <WritingSessionProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: { backgroundColor: tokens.background },
          }}
        >
          <Stack.Screen
            name="login"
            options={{
              presentation: "transparentModal",
              animation: "fade",
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
        </Stack>
      </WritingSessionProvider>
    </AuthProvider>
  );
}
