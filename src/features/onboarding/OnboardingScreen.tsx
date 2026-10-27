import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tokens as t } from "@/theme/tokens";
import { episodes, type EpisodeId, type SceneId } from "./episodes";
import { FadeIn } from "./fade-in";
import { InstaCard } from "./cards/InstaCard";
import { JaniCard } from "./cards/JaniCard";
import { KakaoCard } from "./cards/KakaoCard";
import { photos } from "./cards/pieces";

const cards = { kakao: KakaoCard, insta: InstaCard, jani: JaniCard } as const;

// 시안의 CTA: 좌우 꽉 찬 알약형. 첫 번째는 크림 채움, 보조는 어두운 채움입니다.
function CtaButton({
  label,
  primary,
  onPress,
}: {
  label: string;
  primary: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.cta,
        primary ? styles.ctaPrimary : styles.ctaSecondary,
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text style={primary ? styles.ctaPrimaryText : styles.ctaSecondaryText}>
        {label}
      </Text>
    </Pressable>
  );
}

// 시안(2-02) 구성: 어두운 배경 위 To My X, 상황 재현 패널(진입·선택·행동 A만),
// 장면 라벨·서사, 하단 고정 프롬프트와 CTA 순서로 페이드 인합니다.
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
  // B·여운 장면은 시안대로 패널 없이 배경과 서사만 보여줍니다.
  const hasPanel =
    scene === "enter" || scene === "choice" || scene === "actionA";
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
          "rgba(13,11,8,0.74)",
          "rgba(13,11,8,0.95)",
        ]}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.page,
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <Text accessibilityRole="header" style={styles.brand}>
          To My X
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={styles.body}
        >
          {/* 장면이 바뀔 때마다 연출을 처음부터 다시 재생합니다. */}
          <View
            key={`${episode}-${scene}`}
            testID={current.screen}
            style={styles.scene}
          >
            {hasPanel ? (
              <FadeIn duration={900}>
                <Card scene={scene} />
              </FadeIn>
            ) : (
              <View style={styles.topSpace} />
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
            </View>
            <View style={styles.bottomSpace} />
            {current.prompt && (
              <FadeIn delay={ctaAt}>
                <Text style={[styles.sub, styles.prompt]}>
                  떠오른 말이 있다면, 여기 남겨보세요.
                </Text>
              </FadeIn>
            )}
            <FadeIn delay={ctaAt + 200} style={styles.ctas}>
              {current.ctas.map((cta, index) => (
                <CtaButton
                  key={cta.label}
                  label={cta.label}
                  primary={index === 0}
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
  body: { flexGrow: 1, paddingHorizontal: t.gutter, paddingBottom: 8 },
  scene: { flex: 1 },
  topSpace: { flex: 0.8, minHeight: 90 },
  narration: { gap: 14, paddingTop: 22 },
  bottomSpace: { flex: 1, minHeight: 40 },
  label: { color: t.muted, fontFamily: t.sans, fontSize: 12, letterSpacing: 1 },
  lead: { color: t.text, fontFamily: t.serif, fontSize: 25, lineHeight: 38 },
  sub: { color: "#cfc6b6", fontFamily: t.serif, fontSize: 15, lineHeight: 26 },
  prompt: { marginBottom: 20 },
  ctas: { gap: 12 },
  cta: {
    minHeight: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  ctaPrimary: { backgroundColor: t.text },
  ctaPrimaryText: { color: "#1b1813", fontFamily: t.sans, fontSize: 15, fontWeight: "600" },
  ctaSecondary: { backgroundColor: "#262219" },
  ctaSecondaryText: { color: t.text, fontFamily: t.sans, fontSize: 15 },
});
