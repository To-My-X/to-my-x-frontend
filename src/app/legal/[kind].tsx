import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { FlowPage, flowStyles as f } from '@/components/ui/flow-page';

// 09.02 이용약관 · 09.03 개인정보 처리방침. 승인된 운영 문서(OPEN-03)를 받기 전까지 자리 문구만 표시합니다.
const titles = { terms: '이용약관', privacy: '개인정보 처리방침' } as const;

export default function LegalRoute() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  const title = titles[kind as keyof typeof titles];
  if (!title) return <Redirect href="/settings" />;
  return <FlowPage title={title} onBack={() => router.canGoBack() ? router.back() : router.replace('/settings')}>
    <Text style={f.muted}>시행일 0000년 0월 0일</Text>
    <Text style={f.text}>본문이 들어가는 자리예요.{'\n'}법무 검토를 마친 문구를 넣어 주세요.</Text>
    <Text style={f.muted}>운영 문서가 확정되면 이 내용을 교체합니다.</Text>
  </FlowPage>;
}
