import { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton, Icon, IconButton } from '@/components/ui/feed-actions';
import { tokens as t } from '@/theme/tokens';
import { StoryCard } from './components/story-card';
import { useFeed } from './hooks/use-feed';
import { initialScroll, updateScroll } from './scroll-controls';
import type { FeedScenario } from './types';

export function FeedScreen({ scenario, onWrite }: { scenario: FeedScenario; onWrite?: () => void }) {
  const feed = useFeed(scenario);
  const insets = useSafeAreaInsets();
  const [height, setHeight] = useState(812);
  const [hidden, setHidden] = useState(false);
  const scroll = useRef(initialScroll);
  return <View style={styles.outer}><View style={styles.screen} onLayout={event => setHeight(event.nativeEvent.layout.height)}>
    <FlatList testID="feed-list" data={feed.items} keyExtractor={item => item.id} renderItem={({ item }) => <StoryCard story={item} height={height} />}
      style={styles.list} contentContainerStyle={feed.items.length === 0 ? { flexGrow: 1 } : undefined}
      initialNumToRender={2} maxToRenderPerBatch={3} windowSize={5} showsVerticalScrollIndicator={false}
      onEndReached={feed.loadMore} onEndReachedThreshold={0.5} scrollEventThrottle={16}
      onScroll={event => { const next = updateScroll(scroll.current, event.nativeEvent.contentOffset.y); if (next.hidden !== scroll.current.hidden) setHidden(next.hidden); scroll.current = next; }}
      ListEmptyComponent={<View style={[styles.status, { minHeight: height, paddingTop: insets.top + 120, paddingBottom: insets.bottom + 120 }]}>
        {feed.loading ? <View style={styles.loading}><ActivityIndicator accessibilityLabel="이야기 불러오는 중" color={t.muted} /><Text style={styles.description}>이야기를 불러오고 있어요.</Text></View> : <>
          <View style={styles.statusIcon}><Icon name={feed.error ? 'refresh' : 'bookmark'} size={28} /></View>
          <Text accessibilityRole="header" style={styles.statusTitle}>{feed.error ? '이야기를\n불러오지 못했어요.' : '아직 남겨진\n이야기가 없어요.'}</Text>
          <Text style={styles.description}>{feed.error ? '연결을 확인하고 다시 시도해 주세요.' : '첫 번째 마음을 남겨볼까요?\n당신의 이야기를 기다리고 있어요.'}</Text>
          {feed.error && <ActionButton label="다시 불러오기" onPress={feed.retry} />}
        </>}
      </View>}
      ListFooterComponent={feed.items.length > 0 && (feed.loading || feed.error) ? <View style={styles.pagination}>{feed.loading ? <ActivityIndicator accessibilityLabel="다음 이야기 불러오는 중" color={t.text} /> : <><Text style={styles.description}>다음 이야기를 불러오지 못했어요.</Text><ActionButton label="다음 이야기 다시 불러오기" onPress={feed.retry} /></>}</View> : null}
    />
    <View pointerEvents="box-none" style={[styles.header, { top: insets.top + 22 }]}><Text style={styles.brand}>To My X</Text>{!hidden && <View style={styles.bell}><IconButton icon="bell" label="알림" /></View>}</View>
    <View pointerEvents="box-none" style={[styles.footer, { bottom: insets.bottom + 20 }]}>
      <View style={styles.navigation}>{!hidden && <><IconButton icon="mute" label="소리 꺼짐" /><View style={styles.tabs}><Pressable disabled accessibilityRole="tab" accessibilityState={{ selected: true, disabled: true }} style={[styles.tab, styles.selected]}><Text style={styles.tabText}>스토리</Text></Pressable><Pressable disabled accessibilityRole="tab" accessibilityState={{ disabled: true }} style={styles.tab}><Text style={styles.tabText}>MY</Text></Pressable></View></>}</View>
      <IconButton icon="plus" label="이야기 쓰기" bright onPress={feed.error && feed.items.length === 0 ? undefined : onWrite} />
    </View>
  </View></View>;
}
const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: '#0c0b09', alignItems: 'center' }, screen: { flex: 1, width: '100%', maxWidth: t.maxWidth, backgroundColor: t.background }, list: { flex: 1 },
  header: { position: 'absolute', left: t.gutter, right: t.gutter, height: 48, alignItems: 'center', justifyContent: 'center' }, brand: { color: t.text, fontFamily: t.serif, fontSize: 27, fontWeight: '600' }, bell: { position: 'absolute', right: 0 },
  footer: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }, navigation: { minHeight: 52, flex: 1, flexDirection: 'row', gap: 12, alignItems: 'center' },
  tabs: { flex: 1, flexDirection: 'row', padding: 4, borderRadius: 28, backgroundColor: t.surface, minHeight: 50 }, tab: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 24 }, selected: { backgroundColor: '#7d7a70' }, tabText: { color: t.text, fontFamily: t.sans, fontSize: 13 },
  status: { paddingHorizontal: t.gutter, justifyContent: 'center', gap: 22 }, statusIcon: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: t.line, alignItems: 'center', justifyContent: 'center' }, statusTitle: { fontFamily: t.serif, fontSize: 28, lineHeight: 40, color: t.text }, description: { fontFamily: t.sans, fontSize: 14, lineHeight: 24, color: t.muted }, loading: { alignItems: 'center', gap: 16 }, pagination: { padding: 24, paddingBottom: 130, gap: 18 },
});
