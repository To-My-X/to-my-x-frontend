import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { tokens as t } from "@/theme/tokens";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

// 05.01 빈 상태 · 05.02 목록 · 05.03 로그인 전입니다.
export type NotificationItem = {
  id: string;
  title: string;
  time: string;
  unread: boolean;
};

export function NotificationsScreen({
  guest,
  loading,
  error,
  items,
  hasMore,
  onBack,
  onLogin,
  onRetry,
  onLoadMore,
  onOpen,
}: {
  guest: boolean;
  loading: boolean;
  error: boolean;
  items: NotificationItem[];
  hasMore: boolean;
  onBack: () => void;
  onLogin: () => void;
  onRetry: () => void;
  onLoadMore: () => void;
  onOpen: (id: string) => void;
}) {
  return (
    <FlowPage title="알림" onBack={onBack}>
      {guest ? (
        <>
          <Text accessibilityRole="header" style={f.title}>
            로그인하면 알림을{"\n"}받을 수 있어요.
          </Text>
          <ActionButton label="로그인하기" onPress={onLogin} />
        </>
      ) : loading && items.length === 0 ? (
        <View style={f.group}>
          <ActivityIndicator accessibilityLabel="알림 불러오는 중" color={t.muted} />
          <Text style={f.muted}>알림을 불러오고 있어요.</Text>
        </View>
      ) : error && items.length === 0 ? (
        <>
          <Text accessibilityRole="header" style={f.title}>
            알림을{"\n"}불러오지 못했어요.
          </Text>
          <Text style={f.muted}>연결을 확인하고 다시 시도해 주세요.</Text>
          <ActionButton label="다시 불러오기" onPress={onRetry} />
        </>
      ) : items.length === 0 ? (
        <Text accessibilityRole="header" style={f.title}>
          아직 도착한{"\n"}알림이 없어요.
        </Text>
      ) : (
        <>
          {items.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => onOpen(item.id)}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.titleRow}>
                {item.unread && <View style={styles.dot} />}
                <Text style={item.unread ? styles.unread : f.text}>
                  {item.title}
                </Text>
              </View>
              <Text style={f.muted}>{item.time}</Text>
            </Pressable>
          ))}
          {error && (
            <Text accessibilityRole="alert" style={f.muted}>
              다음 알림을 불러오지 못했어요.
            </Text>
          )}
          {(hasMore || error) && (
            <ActionButton
              label={loading ? "불러오는 중…" : error ? "다시 불러오기" : "더 보기"}
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
  row: { padding: 20, gap: 8, borderRadius: 16, backgroundColor: t.surface },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#d8b98a" },
  unread: {
    fontFamily: t.sans,
    fontSize: 15,
    lineHeight: 25,
    color: t.text,
    fontWeight: "600",
  },
});
