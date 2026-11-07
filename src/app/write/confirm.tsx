import { validBody } from "@/features/writing/body-rules";
import { ConfirmScreen } from "@/features/writing/ConfirmScreen";
import { useWritingSession } from "@/features/writing/writing-session";
import { randomId } from "@/lib/ids";
import { Redirect, router } from "expo-router";
export default function ConfirmRoute() {
  const { draft, submission, setSubmission } = useWritingSession();
  if (!validBody(draft.body)) return <Redirect href="/write" />;
  return (
    <ConfirmScreen
      onEdit={() => router.dismissTo("/write")}
      onSubmit={() => {
        // 공개 승인에서만 시도 ID를 만듭니다. 같은 본문의 재시도는 같은 ID를 재사용하고,
        // 본문을 고쳐 다시 제출할 때만 새 ID를 씁니다(중복 등록 방지 계약).
        if (!submission || submission.body !== draft.body)
          setSubmission({ id: randomId(), body: draft.body });
        router.navigate("/write/result");
      }}
    />
  );
}
