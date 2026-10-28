import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { useState } from "react";
import { Pressable, Text } from "react-native";

export function ConsentScreen({
  onCancel,
  onContinue,
}: {
  onCancel: () => void;
  onContinue: () => void;
}) {
  const [checked, setChecked] = useState([false, false, false]);
  const all = checked.every(Boolean);
  const option = (label: string, selected: boolean, onPress: () => void) => (
    <Pressable
      key={label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={{ paddingVertical: 14 }}
    >
      <Text style={f.text}>
        {selected ? "☑" : "☐"} {label}
      </Text>
    </Pressable>
  );
  return (
    <FlowPage title="시작하기 전에" onBack={onCancel}>
      <Text style={f.muted}>
        운영 약관 문서는 준비 중입니다. 동의 상태는 아직 서버에 저장되지 않고
        이 기기에만 기록됩니다.
      </Text>
      {option("모두 동의하기", all, () => setChecked([!all, !all, !all]))}
      {[
        "이용약관 동의 (필수)",
        "개인정보 처리방침 동의 (필수)",
        "만 14세 이상입니다 (필수)",
      ].map((label, index) =>
        option(label, checked[index], () =>
          setChecked((previous) =>
            previous.map((value, i) => (i === index ? !value : value)),
          ),
        ),
      )}
      <ActionButton
        label="동의하고 시작하기"
        disabled={!all}
        onPress={onContinue}
      />
    </FlowPage>
  );
}
