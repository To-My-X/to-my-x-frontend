import { Image } from "expo-image";
import type { PropsWithChildren } from "react";
import {
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { tokens as t } from "@/theme/tokens";

// 디자인 PDF(2-02)에 임베디드된 원본 사진입니다. 이 이미지가 최종 사용자에게 그대로 보입니다.
export const photos = {
  couple: require("@/assets/images/onboarding/couple-sunset.jpg"),
  portrait: require("@/assets/images/onboarding/x-portrait.jpg"),
  bedroom: require("@/assets/images/onboarding/bedroom-night.jpg"),
  cafe: require("@/assets/images/feed/cafe-night.jpg"),
} as const;

// 카톡·인스타·자니 화면을 재현한 연출 패널입니다. 실제 외부 앱이 아니며 어떤 동작도 하지 않습니다.
export function AppPanel({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[styles.panel, style]}
    >
      {children}
    </View>
  );
}

export function Avatar({
  source,
  size = 44,
  round = false,
}: {
  source: ImageSourcePropType;
  size?: number;
  round?: boolean;
}) {
  return (
    <Image
      source={source}
      contentFit="cover"
      accessible={false}
      style={{
        width: size,
        height: size,
        borderRadius: round ? size / 2 : size * 0.4,
      }}
    />
  );
}

// 비어 있는 친구 아바타(이웃 목록용). 사진 없이 어두운 면으로만 둡니다.
export function BlankAvatar({ size = 44 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.4,
        backgroundColor: "transparent",
      }}
    />
  );
}

export const pieceStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  name: { color: t.text, fontFamily: t.sans, fontSize: 14 },
  caption: { color: t.muted, fontFamily: t.sans, fontSize: 12 },
  icon: { color: t.muted, fontFamily: t.sans, fontSize: 16 },
});

const styles = StyleSheet.create({
  panel: {
    borderRadius: 18,
    backgroundColor: "#16130e",
    borderWidth: 1,
    borderColor: "rgba(245,239,227,0.1)",
    padding: 16,
    overflow: "hidden",
  },
});
