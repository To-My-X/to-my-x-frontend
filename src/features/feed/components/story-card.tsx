import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Icon, IconButton } from '@/components/ui/feed-actions';
import { tokens as t } from '@/theme/tokens';
import type { Story } from '../types';
const backgrounds = { window: require('@/assets/images/feed/window-night.jpg'), cafe: require('@/assets/images/feed/cafe-night.jpg') };
// 웹의 pagingEnabled는 컨테이너에만 snap-type을 설정하므로 카드에 snap 지점을 직접 지정합니다.
export const snapStart = Platform.OS === 'web' ? ({ scrollSnapAlign: 'start' } as unknown as ViewStyle) : null;
export function StoryCard({ story, height, onShare, onMore }: { story: Story; height: number; onShare?: () => void; onMore?: () => void }) {
  return <View testID={story.id} style={[styles.card, snapStart, { height }]}>
    <Image source={backgrounds[story.background]} contentFit="cover" style={StyleSheet.absoluteFill} accessible={false} />
    <LinearGradient colors={['rgba(21,19,15,0.18)', 'rgba(21,19,15,0.15)', 'rgba(21,19,15,0.85)', t.background]} locations={[0, 0.35, 0.68, 1]} style={StyleSheet.absoluteFill} />
    <View style={{ height: height * 0.38 }} />
    <View style={styles.content}>
      {story.metadata && <Text style={styles.metadata}>{story.metadata}</Text>}
      <Text accessibilityRole="header" style={styles.title}>{story.title}</Text>
      <View style={styles.row}>
        {/* 페이지 스냅으로 카드 높이가 고정되므로 긴 본문은 카드 안에서 스크롤합니다. */}
        <ScrollView style={styles.bodyScroll} nestedScrollEnabled showsVerticalScrollIndicator={false}>
          <Text style={styles.body}>{story.body}</Text>
        </ScrollView>
        <View style={styles.actions}><IconButton icon="heart" label="공감" caption="공감" /><IconButton icon="share" label="공유" caption="공유" onPress={onShare} /><IconButton icon="more" label="더보기" caption="더보기" onPress={onMore} /></View>
      </View>
      <Text style={styles.signature}>익명의 X가 남긴 이야기</Text>
    </View>
    <View style={styles.scroll}><Icon name="arrow" size={18} color={t.muted} /><Text style={styles.hint}>SCROLL</Text></View>
  </View>;
}
const styles = StyleSheet.create({
  card: { backgroundColor: t.background, paddingBottom: 100, overflow: 'hidden' },
  content: { flex: 1, paddingHorizontal: t.gutter },
  metadata: { color: t.muted, fontFamily: t.sans, fontSize: 11, marginBottom: 18 },
  title: { color: t.text, fontFamily: t.serif, fontSize: 26, lineHeight: 37, marginBottom: 20 },
  row: { flex: 1, flexDirection: 'row', gap: 14 },
  bodyScroll: { flex: 1 },
  body: { color: '#ded5c5', fontFamily: t.serif, fontSize: 16, lineHeight: 28 },
  actions: { gap: 12, marginTop: -35, alignSelf: 'flex-start' },
  signature: { fontFamily: t.sans, color: t.muted, fontSize: 11, marginTop: 16 },
  scroll: { flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', paddingTop: 10 },
  hint: { color: t.muted, fontFamily: t.sans, fontSize: 11, letterSpacing: 1 },
});
