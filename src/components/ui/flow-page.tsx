import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from './feed-actions';
import { tokens as t } from '@/theme/tokens';

export function FlowPage({ title, onBack, children }: PropsWithChildren<{ title: string; onBack: () => void }>) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={styles.outer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.page, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <ActionButton label="뒤로" onPress={onBack} />
          <Text accessibilityRole="header" style={styles.heading}>{title}</Text>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>{children}</ScrollView>
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
  outer: { flex: 1, backgroundColor: t.background, alignItems: 'center' },
  page: { flex: 1, width: '100%', maxWidth: t.maxWidth },
  header: { flexDirection: 'row', alignItems: 'center', gap: 24, padding: 20 },
  heading: { fontFamily: t.serif, fontSize: 20, color: t.text },
  body: { flexGrow: 1, padding: 24, gap: 24, paddingBottom: 48 },
});
