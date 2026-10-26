import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionButton } from "@/components/ui/feed-actions";
import { tokens as t } from "@/theme/tokens";
import { episodes, type EpisodeId, type SceneId } from "./episodes";
import { FadeIn } from "./fade-in";
import { InstaCard } from "./cards/InstaCard";
import { JaniCard } from "./cards/JaniCard";
import { KakaoCard } from "./cards/KakaoCard";
import { photos } from "./cards/pieces";

const cards = { kakao: KakaoCard, insta: InstaCard, jani: JaniCard } as const;

// 시안(2-02) 구성: 어두운 배경 위 To My X, 상황 재현 패널, 장면 라벨, 서사, CTA 순서로 페이드 인합니다.
// 뒤로 버튼은 시안에 없으며 시스템 뒤로만 직전 장면을 복원합니다(라우트에서 처리).
export function OnboardingScreen({
  episode,
  scene,
  onAdvance,
  onWrite,
}: {
  episode: EpisodeId;
  scene: SceneId;
  onAdvance: (next: SceneId) => void;
  onWrite: () => void;
}) {
  const insets = useSafeAreaInsets();
  const current = episodes[episode][scene];
  const Card = cards[episode];
  // 시안에서 B·여운 일부 장면은 재현 패널 없이 배경과 서사만 보여줍니다(각 카드가 null 반환).
  const hasPanel =
    episode === "kakao"
      ? scene !== "actionB"
      : scene === "enter" || scene === "choice" || scene === "actionA";
  const narrationAt = hasPanel ? 700 : 300;
  const ctaAt = narrationAt + 350 * (current.lines.length + 1);
  return (
    <View style={styles.outer}>
      <Image
        source={photos.bedroom}
        contentFit="cover"
        accessible={false}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[
          "rgba(13,11,8,0.82)",
          "rgba(13,11,8,0.72)",
          "rgba(13,11,8,0.94)",
        ]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.page, { paddingTop: insets.top + 18, paddingBottom: insets.bottom }]}>
        <Text accessibilityRole="header" style={styles.brand}>
          To My X
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.body}
        >
          {/* 장면이 바뀔 때마다 연출을 처음부터 다시 재생합니다. */}
          <View key={`${episode}-${scene}`} testID={current.screen} style={styles.scene}>
            {hasPanel && (
              <FadeIn duration={900}>
                <Card scene={scene} />
              </FadeIn>
            )}
            <View style={styles.narration}>
              <FadeIn delay={narrationAt}>
                <Text style={styles.label}>{current.title}</Text>
              </FadeIn>
              {current.lines.map((line, index) => (
                <FadeIn key={line} delay={narrationAt + 350 * (index + 1)}>
                  <Text style={index === 0 ? styles.lead : styles.sub}>
                    {line}
                  </Text>
                </FadeIn>
              ))}
              {current.prompt && (
                <FadeIn delay={ctaAt}>
                  <Text style={styles.sub}>
                    떠오른 말이 있다면, 여기 남겨보세요.
                  </Text>
                </FadeIn>
              )}
            </View>
            <FadeIn delay={ctaAt + 200} style={styles.ctas}>
              {current.ctas.map((cta, index) => (
                <ActionButton
                  key={cta.label}
                  label={cta.label}
                  bright={index === 0}
                  onPress={() =>
                    cta.to === "write" ? onWrite() : onAdvance(cta.to)
                  }
                />
              ))}
            </FadeIn>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: "#0d0b08", alignItems: "center" },
  page: { flex: 1, width: "100%", maxWidth: t.maxWidth },
  brand: {
    color: t.text,
    fontFamily: t.serif,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  body: { flexGrow: 1, paddingHorizontal: t.gutter, paddingBottom: 40 },
  scene: { flex: 1, gap: 20 },
  narration: { flex: 1, gap: 14, justifyContent: "flex-end", paddingTop: 10 },
  label: { color: t.muted, fontFamily: t.sans, fontSize: 12, letterSpacing: 1 },
  lead: { color: t.text, fontFamily: t.serif, fontSize: 25, lineHeight: 38 },
  sub: { color: "#cfc6b6", fontFamily: t.serif, fontSize: 15, lineHeight: 26 },
  ctas: { gap: 12, marginTop: 20 },
});
