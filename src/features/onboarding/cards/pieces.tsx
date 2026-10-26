import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { tokens as t } from "@/theme/tokens";

// 카톡·인스타·자니 상황을 재현한 연출용 조각입니다. 실제 외부 앱 UI가 아니며 어떤 동작도 하지 않습니다.
export function SceneCard({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[styles.card, style]}
    >
      {children}
    </View>
  );
}

export function Avatar({ label, size = 40, warm = false }: { label: string; size?: number; warm?: boolean }) {
  const base = { width: size, height: size, borderRadius: size * 0.38 };
  if (warm)
    return (
      <LinearGradient colors={["#6b5a43", "#3a3127"]} style={[base, styles.avatarCenter]}>
        <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{label}</Text>
      </LinearGradient>
    );
  return (
    <View style={[base, styles.avatar, styles.avatarCenter]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{label}</Text>
    </View>
  );
}

// 사진이 들어갈 자리의 따뜻한 그라데이션. 실제 자산 확보 전까지의 연출입니다.
export function Photo({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <LinearGradient
      colors={["#5d4e3a", "#2e2820", "#1b1713"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.photo, style]}
    />
  );
}

export const pieceStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  name: { color: t.text, fontFamily: t.sans, fontSize: 14 },
  caption: { color: t.muted, fontFamily: t.sans, fontSize: 12 },
  divider: { height: 1, backgroundColor: t.line },
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: "#1d1a15",
    borderWidth: 1,
    borderColor: t.line,
    padding: 18,
    overflow: "hidden",
  },
  avatar: { backgroundColor: "#3a362e" },
  avatarCenter: { alignItems: "center", justifyContent: "center" },
  avatarText: { color: t.text, fontFamily: t.sans },
  photo: { borderRadius: 14 },
});
