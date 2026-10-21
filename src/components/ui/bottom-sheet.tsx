import type { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { tokens as t } from '@/theme/tokens';

export function BottomSheet({ visible, onClose, children }: PropsWithChildren<{ visible: boolean; onClose: () => void }>) {
  return <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
    <View style={styles.overlay}>
      <Pressable accessibilityRole="button" accessibilityLabel="닫기" style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.sheet} accessibilityViewIsModal>{children}</View>
    </View>
  </Modal>;
}
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { width: '100%', maxWidth: t.maxWidth, padding: 24, paddingBottom: 40, gap: 18, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: t.surface },
});
