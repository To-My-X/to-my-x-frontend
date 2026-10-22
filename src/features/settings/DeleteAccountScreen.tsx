import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { useState } from "react";
import { Pressable, Text } from "react-native";

// 09.05 탈퇴 안내·확인과 09.06 완료입니다. 실제 탈퇴 API는 연결하지 않았습니다.
export function DeleteAccountScreen({
  onBack,
  onFinish,
}: {
  onBack: () => void;
  onFinish: () => void;
}) {
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);
  if (done)
    return (
      <FlowPage title="To My X" onBack={onFinish}>
        <Text accessibilityRole="header" style={f.title}>
          탈퇴가{"\n"}완료됐어요.
        </Text>
        <Text style={f.muted}>그동안 To My X를 이용해 주셔서 고마워요.</Text>
        <Text style={f.muted}>
          화면 연결 확인 단계로, 실제 계정은 삭제되지 않았습니다.
        </Text>
        <ActionButton label="처음으로" onPress={onFinish} />
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
      <ActionButton
        label="탈퇴하기"
        disabled={!checked}
        onPress={() => setDone(true)}
      />
      <ActionButton label="계속 사용하기" onPress={onBack} />
    </FlowPage>
  );
}
