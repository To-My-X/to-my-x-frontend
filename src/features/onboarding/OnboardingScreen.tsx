import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { Text, View } from "react-native";
import { episodes, type EpisodeId, type SceneId } from "./episodes";
import { FadeIn } from "./fade-in";
import { InstaCard } from "./cards/InstaCard";
import { JaniCard } from "./cards/JaniCard";
import { KakaoCard } from "./cards/KakaoCard";

const cards = { kakao: KakaoCard, insta: InstaCard, jani: JaniCard } as const;

// 배정·진행 저장과 리소스 준비 상태는 미구현입니다. 장면 연출과 CTA 전이만 담당합니다.
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
  const Card = cards[episode];
  const narrationAt = 600;
  const ctaAt = narrationAt + 400 * (current.lines.length + 1);
  return (
    <FlowPage title="To My X" onBack={onBack}>
      {/* 장면이 바뀔 때마다 연출을 처음부터 다시 재생합니다. */}
      <View key={`${episode}-${scene}`} testID={current.screen} style={f.group}>
        <FadeIn duration={900}>
          <Card scene={scene} />
        </FadeIn>
        <FadeIn delay={narrationAt}>
          <Text accessibilityRole="header" style={f.title}>
            {current.title}
          </Text>
        </FadeIn>
        {current.lines.map((line, index) => (
          <FadeIn key={line} delay={narrationAt + 400 * (index + 1)}>
            <Text style={f.text}>{line}</Text>
          </FadeIn>
        ))}
        {current.prompt && (
          <FadeIn delay={ctaAt}>
            <Text style={f.muted}>떠오른 말이 있다면, 여기 남겨보세요.</Text>
          </FadeIn>
        )}
        <FadeIn delay={ctaAt + 200} style={f.group}>
          {current.ctas.map((cta) => (
            <ActionButton
              key={cta.label}
              label={cta.label}
              onPress={() => (cta.to === "write" ? onWrite() : onAdvance(cta.to))}
            />
          ))}
        </FadeIn>
      </View>
    </FlowPage>
  );
}
