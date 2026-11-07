import { IconButton } from "@/components/ui/feed-actions";
import { useSession } from "@/features/auth/auth-session";
import { tokens as t } from "@/theme/tokens";
import { router, usePathname } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 스토리·MY 공통 하단 내비게이션 바입니다. 탭 전환 시에도 바는 고정됩니다.
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { status } = useSession();
  const pathname = usePathname();
  const feedActive = pathname !== "/my";
  return (
    <Tabs style={styles.root}>
      {/* 웹에서 기본 flex-basis:auto가 내용 높이만큼 늘어나므로 부모 높이에 고정합니다. */}
      <TabSlot style={styles.root} />
      <View
        pointerEvents="box-none"
        style={[styles.overlay, { bottom: insets.bottom + 20 }]}
      >
        <View pointerEvents="box-none" style={styles.bar}>
          <View style={styles.navigation}>
            <IconButton icon="mute" label="소리 꺼짐" />
            <View style={styles.tabs}>
              <TabTrigger
                name="index"
                accessibilityRole="tab"
                accessibilityState={{ selected: feedActive }}
                style={[styles.tab, feedActive && styles.selected]}
              >
                <Text style={styles.tabText}>스토리</Text>
              </TabTrigger>
              <TabTrigger
                name="my"
                accessibilityRole="tab"
                accessibilityState={{ selected: !feedActive }}
                style={[styles.tab, !feedActive && styles.selected]}
              >
                <Text style={styles.tabText}>MY</Text>
              </TabTrigger>
            </View>
          </View>
          <IconButton
            icon="plus"
            label="이야기 쓰기"
            bright
            onPress={() =>
              router.push(status === "ready" ? "/write" : "/login")
            }
          />
        </View>
      </View>
      <TabList style={styles.hiddenList}>
        <TabTrigger name="index" href="/" />
        <TabTrigger name="my" href="/my" />
      </TabList>
    </Tabs>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  hiddenList: { display: "none" },
  overlay: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  bar: {
    width: "100%",
    maxWidth: t.maxWidth,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  navigation: {
    minHeight: 52,
    flex: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  tabs: {
    flex: 1,
    flexDirection: "row",
    padding: 4,
    borderRadius: 28,
    backgroundColor: t.surface,
    minHeight: 50,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  selected: { backgroundColor: "#7d7a70" },
  tabText: { color: t.text, fontFamily: t.sans, fontSize: 13 },
});
