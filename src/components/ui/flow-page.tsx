import { tokens as t } from "@/theme/tokens";
import type { PropsWithChildren, ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionButton } from "./feed-actions";

export function FlowPage({
  title,
  onBack,
  right,
  footer,
  children,
}: PropsWithChildren<{
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  footer?: ReactNode;
}>) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={styles.outer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[
          styles.page,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.header}>
          {onBack && <ActionButton label="뒤로" onPress={onBack} />}
          <Text accessibilityRole="header" style={styles.heading}>
            {title}
          </Text>
          {right && <View style={styles.right}>{right}</View>}
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.body}
        >
          <Animated.View
            entering={FadeInDown.duration(260)}
            style={styles.animated}
          >
            {children}
          </Animated.View>
        </ScrollView>
        {footer}
      </View>
    </KeyboardAvoidingView>
  );
}
export const flowStyles = StyleSheet.create({
  title: { fontFamily: t.serif, fontSize: 26, lineHeight: 38, color: t.text },
  text: { fontFamily: t.sans, fontSize: 15, lineHeight: 26, color: t.text },
  muted: { fontFamily: t.sans, fontSize: 13, lineHeight: 22, color: t.muted },
  group: { gap: 16 },
});
const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: t.background, alignItems: "center" },
  page: { flex: 1, width: "100%", maxWidth: t.maxWidth },
  header: { flexDirection: "row", alignItems: "center", gap: 24, padding: 20 },
  right: { marginLeft: "auto" },
  heading: { fontFamily: t.serif, fontSize: 20, color: t.text },
  body: { flexGrow: 1, padding: 24, paddingBottom: 48 },
  animated: { flex: 1, gap: 24 },
});
