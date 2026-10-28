import { useSession } from "@/features/auth/auth-session";
import { MyScreen } from "@/features/my/MyScreen";
import { myStories } from "@/features/stories/mock-story";
import { router, useLocalSearchParams } from "expo-router";

export default function MyRoute() {
  const { status } = useSession();
  const { scenario } = useLocalSearchParams<{ scenario?: string }>();
  const stories = __DEV__ && scenario === "empty" ? [] : myStories;
  return (
    <MyScreen
      guest={status !== "ready"}
      stories={stories}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      onLogin={() =>
        router.push({ pathname: "/login", params: { next: "my" } })
      }
      onOpen={(id) => router.push(`/stories/${id}`)}
      onSettings={() => router.push("/settings")}
      onStories={() =>
        router.canGoBack() ? router.dismissTo("/") : router.replace("/")
      }
    />
  );
}
