import { ActionButton } from "@/components/ui/feed-actions";
import { FlowPage, flowStyles as f } from "@/components/ui/flow-page";
import { tokens as t } from "@/theme/tokens";
import { StyleSheet, Text, View } from "react-native";

// 05.01 빈 상태 · 05.02 목록 · 05.03 로그인 전입니다.
export type NotificationItem = { id: string; title: string; time: string };

export function NotificationsScreen({
  guest,
  items,
  onBack,
  onLogin,
}: {
  guest: boolean;
  items: NotificationItem[];
  onBack: () => void;
  onLogin: () => void;
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
      ) : items.length === 0 ? (
        <Text accessibilityRole="header" style={f.title}>
          아직 도착한{"\n"}알림이 없어요.
        </Text>
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={f.text}>{item.title}</Text>
            <Text style={f.muted}>{item.time}</Text>
          </View>
        ))
      )}
    </FlowPage>
  );
}
const styles = StyleSheet.create({
  row: { padding: 20, gap: 8, borderRadius: 16, backgroundColor: t.surface },
});
