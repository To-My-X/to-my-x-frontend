import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { tokens as t } from '@/theme/tokens';

// RN Modal 안에서는 reanimated 진입 애니메이션이 네이티브에서 동작하지 않아 화면 위 오버레이로 그립니다.
// ponytail: 하드웨어 뒤로 가기(onRequestClose) 처리는 생략. 필요해지면 BackHandler를 연결합니다.
export function BottomSheet({ visible, onClose, children }: PropsWithChildren<{ visible: boolean; onClose: () => void }>) {
  if (!visible) return null;
  return <View style={[StyleSheet.absoluteFill, styles.overlay]}>
    <Animated.View entering={FadeIn.duration(180)} style={[StyleSheet.absoluteFill, styles.backdrop]}>
      <Pressable accessibilityRole="button" accessibilityLabel="닫기" style={StyleSheet.absoluteFill} onPress={onClose} />
    </Animated.View>
    <Animated.View entering={SlideInDown.springify().damping(26).stiffness(260)} style={styles.sheet} accessibilityViewIsModal>{children}</Animated.View>
  </View>;
}
const styles = StyleSheet.create({
  overlay: { justifyContent: 'flex-end', alignItems: 'center', zIndex: 10 },
  backdrop: { backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { width: '100%', maxWidth: t.maxWidth, padding: 24, paddingBottom: 40, gap: 18, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: t.surface },
});
