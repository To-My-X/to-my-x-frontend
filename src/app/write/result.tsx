import { validBody } from "@/features/writing/body-rules";
import { ResultScreen } from "@/features/writing/ResultScreen";
import { useWritingSession } from "@/features/writing/writing-session";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function ResultRoute() {
  const { draft, clear } = useWritingSession();
  const { scenario } = useLocalSearchParams<{ scenario?: string }>();
  const [submittable] = useState(() => validBody(draft.body));
  if (!submittable) return <Redirect href="/write" />;
  const leave = (path: "/" | "/my") => {
    clear();
    router.dismissTo(path);
  };
  return (
    <ResultScreen
      failFirst={__DEV__ && scenario === "fail"}
      onExplore={() => leave("/")}
      onMyStories={() => leave("/my")}
      onEdit={() => router.dismissTo("/write")}
    />
  );
}
