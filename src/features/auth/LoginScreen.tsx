import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { ActionButton } from '@/components/ui/feed-actions';
import { flowStyles as f } from '@/components/ui/flow-page';
import { tokens as t } from '@/theme/tokens';
import { mockAuthEnabled } from './mock-session';

export function LoginScreen({ onCancel, onMockLogin }: { onCancel: () => void; onMockLogin: () => void }) {
  return <View style={styles.overlay}>
    <Animated.View entering={FadeIn.duration(180)} style={[StyleSheet.absoluteFill, styles.backdrop]}>
      <Pressable accessibilityRole="button" accessibilityLabel="로그인 닫기" style={StyleSheet.absoluteFill} onPress={onCancel} />
    </Animated.View>
    <Animated.View entering={SlideInDown.springify().damping(26).stiffness(260)} style={styles.sheet} accessibilityViewIsModal>
      <Text accessibilityRole="header" style={f.title}>이 마음을 남기려면</Text>
      <Text style={f.muted}>로그인하고 당신의 이야기를 남겨보세요.</Text>
      {['Apple', 'Google', '카카오'].map(provider => <ActionButton key={provider} label={`${provider}로 계속하기`} disabled />)}
      <ActionButton label="나중에 할게요" onPress={onCancel} />
      {mockAuthEnabled && <View style={f.group}>
        <Text style={f.muted}>개발용 화면 연결 · 실제 계정으로 로그인하지 않습니다.</Text>
        <ActionButton label="Mock 로그인으로 연결 확인" onPress={onMockLogin} />
      </View>}
    </Animated.View>
  </View>;
}
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  backdrop: { backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { width: '100%', maxWidth: t.maxWidth, padding: 24, paddingBottom: 40, gap: 18, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: t.surface },
});
