import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { tokens as t } from "@/theme/tokens";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

// 03.05 등록 중 · 03.06 완료 · 03.11 실패 · 03.12 재시도입니다. 서버 등록 없이 mock 타이머로 상태를 연결합니다.
type Phase = "submitting" | "done" | "failed" | "retrying";

export function ResultScreen({
  failFirst,
  onExplore,
  onMyStories,
  onEdit,
}: {
  failFirst: boolean;
  onExplore: () => void;
  onMyStories: () => void;
  onEdit: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("submitting");
  useEffect(() => {
    if (phase !== "submitting" && phase !== "retrying") return;
    const timer = setTimeout(
      () => setPhase(phase === "submitting" && failFirst ? "failed" : "done"),
      1000,
    );
    return () => clearTimeout(timer);
  }, [phase, failFirst]);
  const busy = phase === "submitting" || phase === "retrying";
  return (
    <FlowPage title="To My X" onBack={phase === "failed" ? onEdit : undefined}>
      {busy ? (
        <View style={f.group}>
          <ActivityIndicator
            accessibilityLabel={
              phase === "retrying" ? "다시 남기는 중" : "남기는 중"
            }
            color={t.muted}
          />
          <Text accessibilityRole="header" style={f.title}>
            {phase === "retrying"
              ? "다시 전하고 있어요."
              : "마음을 남기고 있어요."}
          </Text>
          <Text style={f.muted}>
            {phase === "retrying"
              ? "작성한 마음을 그대로 담아\n한 번 더 시도하고 있어요."
              : "잠시만 기다려 주세요.\n작성한 글을 안전하게 전하고 있어요."}
          </Text>
        </View>
      ) : phase === "done" ? (
        <>
          <Text accessibilityRole="header" style={f.title}>
            마음이 남겨졌어요.
          </Text>
          <Text style={f.muted}>
            누군가도, 당신처럼{"\n"}전하지 못한 말을 남겼을지 몰라요.
          </Text>
          <Text style={f.muted}>
            화면 연결 확인 단계로, 실제로 게시되지 않았습니다.
          </Text>
          <ActionButton label="다른 이야기 읽어보기" onPress={onExplore} />
          <ActionButton label="내가 남긴 글 보기" onPress={onMyStories} />
        </>
      ) : (
        <>
          <Text accessibilityRole="header" style={f.title}>
            마음을 남기지{"\n"}못했어요.
          </Text>
          <Text style={f.muted}>
            작성한 내용은 그대로 남아 있어요.{"\n"}연결을 확인하고 다시 시도해
            주세요.
          </Text>
          <ActionButton
            label="다시 시도하기"
            onPress={() => setPhase("retrying")}
          />
          <ActionButton label="글로 돌아가기" onPress={onEdit} />
        </>
      )}
    </FlowPage>
  );
}
