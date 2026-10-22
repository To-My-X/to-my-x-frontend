import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { Text, View } from "react-native";
import { episodes, type EpisodeId, type SceneId } from "./episodes";

// 배정·진행 저장과 리소스 준비 상태는 미구현입니다. 장면 표시와 CTA 전이만 연결합니다.
export function OnboardingScreen({
  episode,
  scene,
  onAdvance,
  onWrite,
  onBack,
}: {
  episode: EpisodeId;
  scene: SceneId;
  onAdvance: (next: SceneId) => void;
  onWrite: () => void;
  onBack: () => void;
}) {
  const current = episodes[episode][scene];
  return (
    <FlowPage title="To My X" onBack={onBack}>
      <Text accessibilityRole="header" style={f.title}>
        {current.title}
      </Text>
      {current.lines.map((line) => (
        <Text key={line} style={f.text}>
          {line}
        </Text>
      ))}
      {current.prompt && (
        <Text style={f.muted}>떠오른 말이 있다면, 여기 남겨보세요.</Text>
      )}
      <View style={f.group}>
        {current.ctas.map((cta) => (
          <ActionButton
            key={cta.label}
            label={cta.label}
            onPress={() => (cta.to === "write" ? onWrite() : onAdvance(cta.to))}
          />
        ))}
      </View>
    </FlowPage>
  );
}
