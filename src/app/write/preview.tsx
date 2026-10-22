import { validBody } from "@/features/writing/body-rules";
import { PreviewScreen } from "@/features/writing/PreviewScreen";
import { useWritingSession } from "@/features/writing/writing-session";
import { Redirect, router } from "expo-router";
export default function PreviewRoute() {
  const { draft } = useWritingSession();
  if (!validBody(draft.body)) return <Redirect href="/write" />;
  return (
    <PreviewScreen
      body={draft.body}
      onBack={() => router.dismissTo("/write")}
      onConfirm={() => router.navigate("/write/confirm")}
    />
  );
}
