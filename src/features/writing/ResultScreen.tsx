import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { ApiError } from "@/lib/api";
import { tokens as t } from "@/theme/tokens";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

// 03.05 등록 중 · 03.06 완료 · 03.11 실패/결과 확인 · 03.12 재시도입니다.
// 재시도는 기존 시도의 결과 확인부터 시작합니다(submit의 checkFirst).
type Phase =
  | { name: "submitting" }
  | { name: "retrying" }
  | { name: "done"; postId: string }
  | { name: "failed"; message: string; authRequired: boolean; waitUntil: number | null };

const failureOf = (error: unknown): Phase => {
  if (error instanceof ApiError) {
    if (error.status === 401)
      return {
        name: "failed",
        message: "로그인이 만료됐어요. 다시 로그인하면 작성한 글로 돌아와요.",
        authRequired: true,
        waitUntil: null,
      };
    return {
      name: "failed",
      message:
        error.code === "NETWORK"
          ? "연결이 불안정해 결과를 확인하지 못했어요.\n작성한 내용은 그대로 남아 있어요."
          : error.message,
      authRequired: false,
      waitUntil: error.retryAfter ? Date.now() + error.retryAfter * 1000 : null,
    };
  }
  return {
    name: "failed",
    message: "작성한 내용은 그대로 남아 있어요.\n연결을 확인하고 다시 시도해 주세요.",
    authRequired: false,
    waitUntil: null,
  };
};

export function ResultScreen({
  submit,
  onDone,
  onExplore,
  onMyStory,
  onEdit,
  onLogin,
}: {
  // checkFirst가 참이면 기존 시도 결과를 먼저 확인한 뒤 미등록일 때만 다시 등록합니다.
  submit: (checkFirst: boolean) => Promise<string>;
  // 성공 확정 직후 1회(초안·시도 정리와 목록 무효화용)
  onDone: (postId: string) => void;
  onExplore: () => void;
  onMyStory: (postId: string) => void;
  onEdit: () => void;
  onLogin: () => void;
}) {
  const [phase, setPhase] = useState<Phase>({ name: "submitting" });
  const [now, setNow] = useState(() => Date.now());
  const startedRef = useRef(false);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });
  const run = (retry: boolean) => {
    setPhase(retry ? { name: "retrying" } : { name: "submitting" });
    submit(retry)
      .then((postId) => {
        doneRef.current(postId);
        setPhase({ name: "done", postId });
      })
      .catch((error) => setPhase(failureOf(error)));
  };
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    run(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 도배 방지(429)의 retryAfter 동안 재시도 버튼을 비활성화하고 남은 시간을 안내합니다.
  const waitUntil = phase.name === "failed" ? phase.waitUntil : null;
  useEffect(() => {
    if (!waitUntil) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [waitUntil]);
  const waitSeconds = waitUntil
    ? Math.max(0, Math.ceil((waitUntil - now) / 1000))
    : 0;
  if (phase.name === "submitting" || phase.name === "retrying") {
    const retrying = phase.name === "retrying";
    return (
      <FlowPage title="To My X">
        <View style={f.group}>
          <ActivityIndicator
            accessibilityLabel={retrying ? "다시 남기는 중" : "남기는 중"}
            color={t.muted}
          />
          <Text accessibilityRole="header" style={f.title}>
            {retrying ? "다시 전하고 있어요." : "마음을 남기고 있어요."}
          </Text>
          <Text style={f.muted}>
            {retrying
              ? "작성한 마음을 그대로 담아\n한 번 더 시도하고 있어요."
              : "잠시만 기다려 주세요.\n작성한 글을 안전하게 전하고 있어요."}
          </Text>
        </View>
      </FlowPage>
    );
  }
  if (phase.name === "done")
    return (
      <FlowPage title="To My X">
        <Text accessibilityRole="header" style={f.title}>
          마음이 남겨졌어요.
        </Text>
        <Text style={f.muted}>
          누군가도, 당신처럼{"\n"}전하지 못한 말을 남겼을지 몰라요.
        </Text>
        <ActionButton label="다른 이야기 읽어보기" onPress={onExplore} />
        <ActionButton
          label="내가 남긴 글 보기"
          onPress={() => onMyStory(phase.postId)}
        />
      </FlowPage>
    );
  return (
    <FlowPage title="To My X" onBack={onEdit}>
      <Text accessibilityRole="header" style={f.title}>
        마음을 남기지{"\n"}못했어요.
      </Text>
      <Text style={f.muted}>{phase.message}</Text>
      {waitSeconds > 0 && (
        <Text accessibilityRole="alert" style={f.muted}>
          {waitSeconds}초 뒤에 다시 시도할 수 있어요.
        </Text>
      )}
      {phase.authRequired ? (
        <ActionButton label="다시 로그인하기" onPress={onLogin} />
      ) : (
        <ActionButton
          label="다시 시도하기"
          disabled={waitSeconds > 0}
          onPress={() => run(true)}
        />
      )}
      <ActionButton label="글로 돌아가기" onPress={onEdit} />
    </FlowPage>
  );
}
