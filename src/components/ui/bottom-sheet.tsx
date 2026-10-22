import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet } from 'react-native';
import { tokens as t } from '@/theme/tokens';

const native = Platform.OS !== 'web';

// iOS 기본 시트처럼 바운스 없는 timing 슬라이드를 위해 RN 코어 Animated를 사용합니다.
// RN Modal 안에서는 reanimated 진입 애니메이션이 네이티브에서 동작하지 않아 화면 위 오버레이로 그립니다.
// ponytail: 하드웨어 뒤로 가기(onRequestClose) 처리는 생략. 필요해지면 BackHandler를 연결합니다.
export function BottomSheet({ visible, onClose, children }: PropsWithChildren<{ visible: boolean; onClose: () => void }>) {
  const [backdrop] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(10000));
  const entered = useRef(false);
  useEffect(() => {
    if (visible) {
      Animated.timing(backdrop, { toValue: 1, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: native }).start();
    } else {
      entered.current = false;
      backdrop.setValue(0);
      translateY.setValue(10000);
    }
  }, [visible, backdrop, translateY]);
  if (!visible) return null;
  return <Animated.View style={[StyleSheet.absoluteFill, styles.overlay]}>
    <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdrop }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="닫기" style={StyleSheet.absoluteFill} onPress={onClose} />
    </Animated.View>
    <Animated.View accessibilityViewIsModal style={[styles.sheet, { transform: [{ translateY }] }]}
      onLayout={event => {
        if (entered.current) return;
        entered.current = true;
        translateY.setValue(event.nativeEvent.layout.height);
        Animated.timing(translateY, { toValue: 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: native }).start();
      }}>{children}</Animated.View>
  </Animated.View>;
}
const styles = StyleSheet.create({
  overlay: { justifyContent: 'flex-end', alignItems: 'center', zIndex: 10 },
  backdrop: { backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { width: '100%', maxWidth: t.maxWidth, padding: 24, paddingBottom: 40, gap: 18, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: t.surface },
});
