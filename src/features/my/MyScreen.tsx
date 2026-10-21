import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '@/components/ui/feed-actions';
import { FlowPage, flowStyles as f } from '@/components/ui/flow-page';
import { tokens as t } from '@/theme/tokens';

// 08.07 로그인 전 · 06.01 빈 상태 · 06.02 내 이야기 목록입니다.
export type MyStory = { id: string; title: string; body: string; postedAt: string };

export function MyScreen({ guest, stories, onBack, onLogin, onOpen, onSettings, onStories }: {
  guest: boolean; stories: MyStory[]; onBack: () => void; onLogin: () => void; onOpen: (id: string) => void; onSettings: () => void; onStories: () => void;
}) {
  const tabs = <View style={styles.tabs}>
    <Pressable accessibilityRole="tab" onPress={onStories} style={styles.tab}><Text style={styles.tabText}>스토리</Text></Pressable>
    <Pressable accessibilityRole="tab" accessibilityState={{ selected: true }} style={[styles.tab, styles.selected]}><Text style={styles.tabText}>MY</Text></Pressable>
  </View>;
  return <FlowPage title="To My X" onBack={onBack} right={!guest && <ActionButton label="설정" onPress={onSettings} />} footer={tabs}>
    {guest ? <>
      <Text accessibilityRole="header" style={f.title}>로그인하면{'\n'}내 이야기를{'\n'}볼 수 있어요.</Text>
      <Text style={f.muted}>로그인한 뒤 남긴 이야기가{'\n'}이곳에 모여요.</Text>
      <ActionButton label="로그인하기" onPress={onLogin} />
    </> : stories.length === 0 ? <>
      <Text style={f.muted}>MY X</Text>
      <Text accessibilityRole="header" style={f.title}>나에게 남은 마음,{'\n'}여기에 적어두세요.</Text>
      <Text style={f.muted}>끝난 사이에도 남아 있는 장면이 있죠.{'\n'}기억나는 만큼만, 천천히 남겨보세요.{'\n'}남긴 이야기는 이곳에서 다시 만날 수 있어요.</Text>
    </> : <>
      <Text style={f.muted}>MY X</Text>
      <Text accessibilityRole="header" style={f.title}>내가 남긴 이야기</Text>
      <Text style={f.muted}>꺼내놓은 마음을 다시 만나보세요.</Text>
      {stories.map(story => <Pressable key={story.id} accessibilityRole="button" onPress={() => onOpen(story.id)} style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}>
        <Text style={f.text}>{story.body.split('\n')[0]}</Text>
        <Text style={f.muted}>{story.postedAt} · 익명 공개</Text>
      </Pressable>)}
    </>}
  </FlowPage>;
}
const styles = StyleSheet.create({
  card: { padding: 20, gap: 12, borderRadius: 16, backgroundColor: t.surface },
  tabs: { flexDirection: 'row', margin: 20, padding: 4, borderRadius: 28, backgroundColor: t.surface },
  tab: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 24 },
  selected: { backgroundColor: '#7d7a70' },
  tabText: { color: t.text, fontFamily: t.sans, fontSize: 13 },
});
