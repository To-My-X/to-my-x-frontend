import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { tokens as t } from "@/theme/tokens";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

// 08.07 로그인 전 · 06.01 빈 상태 · 06.02 내 이야기 목록입니다.
export type MyStory = {
  id: string;
  summary: string;
  postedAt: string;
  suspended: boolean;
};

export function MyScreen({
  guest,
  loading,
  error,
  stories,
  hasMore,
  onLogin,
  onOpen,
  onRetry,
  onLoadMore,
  onSettings,
}: {
  guest: boolean;
  loading: boolean;
  error: boolean;
  stories: MyStory[];
  hasMore: boolean;
  onLogin: () => void;
  onOpen: (id: string) => void;
  onRetry: () => void;
  onLoadMore: () => void;
  onSettings: () => void;
}) {
  return (
    <FlowPage
      title="To My X"
      right={!guest && <ActionButton label="설정" onPress={onSettings} />}
      // 하단 고정 바(탭 레이아웃)가 콘텐츠를 가리지 않도록 자리를 비워둡니다.
      footer={<View style={styles.barSpace} />}
    >
      {guest ? (
        <>
          <Text accessibilityRole="header" style={f.title}>
            로그인하면{"\n"}내 이야기를{"\n"}볼 수 있어요.
          </Text>
          <Text style={f.muted}>
            로그인한 뒤 남긴 이야기가{"\n"}이곳에 모여요.
          </Text>
          <ActionButton label="로그인하기" onPress={onLogin} />
        </>
      ) : loading && stories.length === 0 ? (
        <View style={f.group}>
          <ActivityIndicator
            accessibilityLabel="내 이야기 불러오는 중"
            color={t.muted}
          />
          <Text style={f.muted}>내 이야기를 불러오고 있어요.</Text>
        </View>
      ) : error && stories.length === 0 ? (
        <>
          <Text accessibilityRole="header" style={f.title}>
            내 이야기를{"\n"}불러오지 못했어요.
          </Text>
          <Text style={f.muted}>연결을 확인하고 다시 시도해 주세요.</Text>
          <ActionButton label="다시 불러오기" onPress={onRetry} />
        </>
      ) : stories.length === 0 ? (
        <>
          <Text style={f.muted}>MY X</Text>
          <Text accessibilityRole="header" style={f.title}>
            나에게 남은 마음,{"\n"}여기에 적어두세요.
          </Text>
          <Text style={f.muted}>
            끝난 사이에도 남아 있는 장면이 있죠.{"\n"}기억나는 만큼만, 천천히
            남겨보세요.{"\n"}남긴 이야기는 이곳에서 다시 만날 수 있어요.
          </Text>
        </>
      ) : (
        <>
          <Text style={f.muted}>MY X</Text>
          <Text accessibilityRole="header" style={f.title}>
            내가 남긴 이야기
          </Text>
          <Text style={f.muted}>꺼내놓은 마음을 다시 만나보세요.</Text>
          {stories.map((story) => (
            <Pressable
              key={story.id}
              accessibilityRole="button"
              onPress={() => onOpen(story.id)}
              style={({ pressed }) => [
                styles.card,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={f.text}>{story.summary}</Text>
              <Text style={f.muted}>
                {story.postedAt} ·{" "}
                {story.suspended ? "공개 중단" : "익명 공개"}
              </Text>
            </Pressable>
          ))}
          {error && (
            <Text accessibilityRole="alert" style={f.muted}>
              다음 이야기를 불러오지 못했어요.
            </Text>
          )}
          {(hasMore || error) && (
            <ActionButton
              label={
                loading ? "불러오는 중…" : error ? "다시 불러오기" : "더 보기"
              }
              disabled={loading}
              onPress={error ? onRetry : onLoadMore}
            />
          )}
        </>
      )}
    </FlowPage>
  );
}
const styles = StyleSheet.create({
  card: { padding: 20, gap: 12, borderRadius: 16, backgroundColor: t.surface },
  barSpace: { height: 92 },
});
