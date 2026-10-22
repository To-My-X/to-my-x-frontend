import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { ActionButton } from '@/components/ui/feed-actions';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { FlowPage, flowStyles as f } from '@/components/ui/flow-page';
import { tokens as t } from '@/theme/tokens';

// 09.01 설정과 09.04 로그아웃 확인 시트입니다. 계정 값과 Push는 서버 연동 전 표시만 합니다.
function Row({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" disabled={!onPress} accessibilityState={{ disabled: !onPress }} onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
    <Text style={f.text}>{label}</Text>
    {value && <Text style={f.muted}>{value}</Text>}
  </Pressable>;
}
function Section({ title, children }: { title: string; children: ReactNode }) {
  return <View style={{ gap: 4 }}><Text style={f.muted}>{title}</Text>{children}</View>;
}

export function SettingsScreen({ onBack, onLegal, onLogout, onDeleteAccount }: { onBack: () => void; onLegal: (kind: 'terms' | 'privacy') => void; onLogout: () => void; onDeleteAccount: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return <><FlowPage title="설정" onBack={onBack}>
    <Section title="계정"><Row label="Mock 계정" value="연결 확인용" /></Section>
    <Section title="알림"><Row label="푸시 알림" value="준비 중" /></Section>
    <Section title="안내">
      <Row label="이용약관" onPress={() => onLegal('terms')} />
      <Row label="개인정보 처리방침" onPress={() => onLegal('privacy')} />
      <Row label="문의하기" value="준비 중" />
      <Row label="버전" value={Constants.expoConfig?.version ?? '1.0.0'} />
    </Section>
    <Section title="계정 관리">
      <Row label="로그아웃" onPress={() => setConfirming(true)} />
      <Row label="탈퇴하기" onPress={onDeleteAccount} />
    </Section>
  </FlowPage>
  <BottomSheet visible={confirming} onClose={() => setConfirming(false)}>
    <Text accessibilityRole="header" style={f.title}>로그아웃할까요?</Text>
    <Text style={f.muted}>다시 로그인하면 내 이야기를 그대로 볼 수 있어요.</Text>
    <ActionButton label="로그아웃" onPress={onLogout} />
    <ActionButton label="취소" onPress={() => setConfirming(false)} />
  </BottomSheet></>;
}
const styles = StyleSheet.create({ row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: t.line } });
