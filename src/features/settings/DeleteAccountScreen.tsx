import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { tokens as t } from "@/theme/tokens";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

// 09.05 탈퇴 안내·확인과 09.06 완료입니다. 서버가 삭제를 확인한 뒤에만 완료를 표시합니다.
export function DeleteAccountScreen({
  onBack,
  onFinish,
  // 같은 탈퇴 시도(operationId)의 요청·결과 확인을 라우트가 구현합니다.
  withdraw,
}: {
  onBack: () => void;
  onFinish: () => void;
  withdraw: () => Promise<void>;
}) {
  const [checked, setChecked] = useState(false);
  const [phase, setPhase] = useState<"confirm" | "busy" | "failed" | "done">(
    "confirm",
  );
  const run = () => {
    setPhase("busy");
    withdraw()
      .then(() => setPhase("done"))
      .catch(() => setPhase("failed"));
  };
  if (phase === "done")
    return (
      <FlowPage title="To My X" onBack={onFinish}>
        <Text accessibilityRole="header" style={f.title}>
          탈퇴가{"\n"}완료됐어요.
        </Text>
        <Text style={f.muted}>그동안 To My X를 이용해 주셔서 고마워요.</Text>
        <ActionButton label="처음으로" onPress={onFinish} />
      </FlowPage>
    );
  if (phase === "busy")
    return (
      <FlowPage title="탈퇴하기">
        <View style={f.group}>
          <ActivityIndicator accessibilityLabel="탈퇴 처리 중" color={t.muted} />
          <Text accessibilityRole="header" style={f.title}>
            탈퇴를 처리하고 있어요.
          </Text>
          <Text style={f.muted}>잠시만 기다려 주세요.</Text>
        </View>
      </FlowPage>
    );
  return (
    <FlowPage title="탈퇴하기" onBack={onBack}>
      <Text accessibilityRole="header" style={f.title}>
        탈퇴하기 전에{"\n"}확인해 주세요.
      </Text>
      <Text style={f.text}>
        내가 남긴 이야기와 공감이 모두 삭제돼요.{"\n"}알림과 계정 정보가
        삭제돼요.{"\n\n"}삭제한 내용은 되돌릴 수 없어요.
      </Text>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        onPress={() => setChecked((previous) => !previous)}
        style={{ paddingVertical: 14 }}
      >
        <Text style={f.text}>{checked ? "☑" : "☐"} 위 내용을 확인했어요.</Text>
      </Pressable>
      {phase === "failed" && (
        <Text accessibilityRole="alert" style={f.text}>
          탈퇴를 처리하지 못했어요. 연결을 확인하고 다시 시도해 주세요.
        </Text>
      )}
      <ActionButton
        label={phase === "failed" ? "다시 시도하기" : "탈퇴하기"}
        disabled={!checked}
        onPress={run}
      />
      <ActionButton label="계속 사용하기" onPress={onBack} />
    </FlowPage>
  );
}
