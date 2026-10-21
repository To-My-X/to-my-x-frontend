import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { tokens as t } from '@/theme/tokens';
import { scenarios } from './types';
const labels = ['정상 피드', '지속 로딩', '이야기 없음', '최초 조회 실패 → 재시도', '추가 조회 실패 → 재시도', '긴 글'];
export function FeedPreviewScreen() {
  return <ScrollView contentContainerStyle={styles.container}><Text style={styles.title}>피드 상태 검수</Text><Text style={styles.description}>개발 환경 전용 · mock 60개 / 페이지당 20개{ '\n' }추가 오류는 20번째 이야기 뒤에서 발생합니다.</Text>{scenarios.map((scenario, index) => <Link key={scenario} href={{ pathname: '/', params: { scenario } }} style={styles.link}>{labels[index]}</Link>)}</ScrollView>;
}
const styles = StyleSheet.create({ container: { padding: 28, paddingTop: 60, gap: 20 }, title: { color: t.text, fontSize: 24, fontFamily: t.serif }, description: { color: t.muted, lineHeight: 24 }, link: { padding: 16, color: t.text, backgroundColor: t.surface, borderRadius: 12, fontSize: 16 } });
