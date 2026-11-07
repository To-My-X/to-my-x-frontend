import { ActionButton, Icon, IconButton } from "@/components/ui/feed-actions";
import { tokens as t } from "@/theme/tokens";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { snapStart, StoryCard } from "./components/story-card";
import type { Feed } from "./hooks/use-feed";
import { initialScroll, updateScroll } from "./scroll-controls";
import type { Story } from "./types";

export function FeedScreen({
  feed,
  bellDot = false,
  onBell,
  onReact,
  onShare,
  onMore,
}: {
  feed: Feed;
  bellDot?: boolean;
  onBell?: () => void;
  onReact?: (story: Story) => void;
  onShare?: (story: Story) => void;
  onMore?: (story: Story) => void;
}) {
  const insets = useSafeAreaInsets();
  const [height, setHeight] = useState(812);
  const [hidden, setHidden] = useState(false);
  const scroll = useRef(initialScroll);
  const listRef = useRef<FlatList<Story>>(null);
  const focused = useRef(true);
  // 웹은 탭이 숨겨질 때(display:none) 브라우저가 스크롤 위치를 버리므로, 복귀 시 추적해 둔 위치로 복원합니다.
  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      // 포커스 직후엔 화면이 아직 display:none이라 적용될 때까지 몇 프레임 재시도합니다.
      const y = scroll.current.y;
      let frame = 0;
      let tries = 20;
      const restore = () => {
        scroll.current = { ...scroll.current, y, anchor: y, direction: 0 };
        listRef.current?.scrollToOffset({ offset: y, animated: false });
        const node = listRef.current?.getScrollableNode() as
          | { scrollTop?: number }
          | number
          | null
          | undefined;
        const applied =
          typeof node !== "object" ||
          node === null ||
          typeof node.scrollTop !== "number" ||
          Math.abs(node.scrollTop - y) <= 1;
        if (!applied && --tries > 0) frame = requestAnimationFrame(restore);
      };
      if (y > 0) frame = requestAnimationFrame(restore);
      return () => {
        cancelAnimationFrame(frame);
        focused.current = false;
      };
    }, []),
  );
  return (
    <View style={styles.outer}>
      <View
        style={styles.screen}
        onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
      >
        <FlatList
          ref={listRef}
          testID="feed-list"
          data={feed.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StoryCard
              story={item}
              height={height}
              onReact={onReact && (() => onReact(item))}
              onShare={onShare && (() => onShare(item))}
              onMore={onMore && (() => onMore(item))}
            />
          )}
          style={styles.list}
          contentContainerStyle={
            feed.items.length === 0 ? { flexGrow: 1 } : undefined
          }
          pagingEnabled
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
          initialNumToRender={2}
          maxToRenderPerBatch={3}
          windowSize={5}
          showsVerticalScrollIndicator={false}
          onEndReached={feed.loadMore}
          onEndReachedThreshold={0.5}
          scrollEventThrottle={16}
          onScroll={(event) => {
            // 탭이 숨겨지는 순간 브라우저가 쏘는 0 스크롤 이벤트로 추적 위치가 깨지지 않게 합니다.
            if (!focused.current) return;
            const next = updateScroll(
              scroll.current,
              event.nativeEvent.contentOffset.y,
            );
            if (next.hidden !== scroll.current.hidden) setHidden(next.hidden);
            scroll.current = next;
          }}
          ListEmptyComponent={
            <View
              style={[
                styles.status,
                {
                  minHeight: height,
                  paddingTop: insets.top + 120,
                  paddingBottom: insets.bottom + 120,
                },
              ]}
            >
              {feed.loading ? (
                <View style={styles.loading}>
                  <ActivityIndicator
                    accessibilityLabel="이야기 불러오는 중"
                    color={t.muted}
                  />
                  <Text style={styles.description}>
                    이야기를 불러오고 있어요.
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.statusIcon}>
                    <Icon
                      name={feed.error ? "refresh" : "bookmark"}
                      size={28}
                    />
                  </View>
                  <Text accessibilityRole="header" style={styles.statusTitle}>
                    {feed.error
                      ? "이야기를\n불러오지 못했어요."
                      : "아직 남겨진\n이야기가 없어요."}
                  </Text>
                  <Text style={styles.description}>
                    {feed.error
                      ? "연결을 확인하고 다시 시도해 주세요."
                      : "첫 번째 마음을 남겨볼까요?\n당신의 이야기를 기다리고 있어요."}
                  </Text>
                  {feed.error && (
                    <ActionButton label="다시 불러오기" onPress={feed.retry} />
                  )}
                </>
              )}
            </View>
          }
          ListFooterComponent={
            feed.items.length > 0 && (feed.loading || feed.error) ? (
              <View style={[styles.pagination, snapStart, { height }]}>
                {feed.loading ? (
                  <ActivityIndicator
                    accessibilityLabel="다음 이야기 불러오는 중"
                    color={t.text}
                  />
                ) : (
                  <>
                    <Text style={styles.description}>
                      다음 이야기를 불러오지 못했어요.
                    </Text>
                    <ActionButton
                      label="다음 이야기 다시 불러오기"
                      onPress={feed.retry}
                    />
                  </>
                )}
              </View>
            ) : null
          }
        />
        <View
          pointerEvents="box-none"
          style={[styles.header, { top: insets.top + 22 }]}
        >
          <Text style={styles.brand}>To My X</Text>
          {!hidden && (
            <View style={styles.bell}>
              <IconButton
                icon="bell"
                label={bellDot ? "알림 · 안 읽은 알림 있음" : "알림"}
                badge={bellDot}
                onPress={onBell}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: "#0c0b09", alignItems: "center" },
  screen: {
    flex: 1,
    width: "100%",
    maxWidth: t.maxWidth,
    backgroundColor: t.background,
  },
  list: { flex: 1 },
  header: {
    position: "absolute",
    left: t.gutter,
    right: t.gutter,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    color: t.text,
    fontFamily: t.serif,
    fontSize: 27,
    fontWeight: "600",
  },
  bell: { position: "absolute", right: 0 },
  status: { paddingHorizontal: t.gutter, justifyContent: "center", gap: 22 },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: t.line,
    alignItems: "center",
    justifyContent: "center",
  },
  statusTitle: {
    fontFamily: t.serif,
    fontSize: 28,
    lineHeight: 40,
    color: t.text,
  },
  description: {
    fontFamily: t.sans,
    fontSize: 14,
    lineHeight: 24,
    color: t.muted,
  },
  loading: { alignItems: "center", gap: 16 },
  pagination: {
    padding: 24,
    paddingBottom: 130,
    gap: 18,
    justifyContent: "center",
  },
});
