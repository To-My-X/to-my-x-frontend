import { validBody } from "@/features/writing/body-rules";
import { ConfirmScreen } from "@/features/writing/ConfirmScreen";
import { useWritingSession } from "@/features/writing/writing-session";
import { Redirect, router } from "expo-router";
export default function ConfirmRoute() {
  const { draft } = useWritingSession();
  if (!validBody(draft.body)) return <Redirect href="/write" />;
  return (
    <ConfirmScreen
      onEdit={() => router.dismissTo("/write")}
      onSubmit={() => router.navigate("/write/result")}
    />
  );
}
