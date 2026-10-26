import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens as t } from "@/theme/tokens";
import { FadeIn } from "../fade-in";
import type { SceneId } from "../episodes";
import { AppPanel, Avatar, BlankAvatar, photos, pieceStyles as p } from "./pieces";

const native = Platform.OS !== "web";

// 02.01 친구 목록 · 02.05 다시 친구 목록. 목록이 살짝 흐른 뒤 X의 바뀐 프로필이 눈에 들어옵니다.
function FriendList({ animated }: { animated: boolean }) {
  const [scroll] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!animated) return;
    const animation = Animated.timing(scroll, {
      toValue: 1,
      duration: 1400,
      delay: 500,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: native,
    });
    animation.start();
    return () => animation.stop();
  }, [animated, scroll]);
  const translateY = scroll.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });
  return (
    <AppPanel>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>친구</Text>
        <Text style={p.icon}>⌕ ＋ ⚙</Text>
      </View>
      <Text style={p.caption}>친구 128</Text>
      <Animated.View style={animated && { transform: [{ translateY }] }}>
        <View style={p.row}>
          <BlankAvatar />
          <View>
            <Text style={p.name}>민서</Text>
            <Text style={p.caption}>오늘도 좋은 하루</Text>
          </View>
        </View>
        <FadeIn delay={animated ? 1500 : 200} duration={900} rise={6}>
          <View style={[p.row, styles.highlight]}>
            <Avatar source={photos.couple} size={48} />
            <View>
              <Text style={p.name}>X</Text>
              <Text style={p.caption}>업데이트된 프로필</Text>
            </View>
          </View>
        </FadeIn>
        <View style={p.row}>
          <BlankAvatar />
          <Text style={p.name}>지우</Text>
        </View>
        <View style={p.row}>
          <BlankAvatar />
          <Text style={p.name}>서연</Text>
        </View>
      </Animated.View>
    </AppPanel>
  );
}

// 02.02 프로필 화면
function Profile() {
  return (
    <AppPanel>
      <View style={styles.profileHeader}>
        <Text style={p.icon}>‹</Text>
        <Text style={p.caption}>프로필</Text>
        <Text style={p.icon}>⋯</Text>
      </View>
      <FadeIn duration={1000} style={styles.profileCenter}>
        <Image
          source={photos.couple}
          contentFit="cover"
          accessible={false}
          style={styles.profilePhoto}
        />
        <Text style={[p.name, styles.profileName]}>X</Text>
        <Text style={p.caption}>사진을 누르면 크게 볼 수 있어요</Text>
      </FadeIn>
      <View style={styles.profileActions}>
        {["1:1 채팅", "통화하기", "페이스톡"].map((label) => (
          <Text key={label} style={p.caption}>
            {label}
          </Text>
        ))}
      </View>
    </AppPanel>
  );
}

// 02.03 사진을 크게 본 장면
function PhotoViewer() {
  return (
    <AppPanel style={styles.viewer}>
      <View style={styles.viewerHeader}>
        <Text style={p.icon}>×</Text>
        <Text style={p.caption}>프로필 사진</Text>
        <View style={{ width: 16 }} />
      </View>
      <FadeIn duration={1200} rise={0}>
        <Image
          source={photos.couple}
          contentFit="cover"
          accessible={false}
          style={styles.viewerPhoto}
        />
      </FadeIn>
      <View style={styles.viewerFooter}>
        <Text style={p.caption}>1/1</Text>
        <Text style={p.caption}>저장 공유</Text>
      </View>
    </AppPanel>
  );
}

// 02.04 잠깐의 정지와 02.05 여운은 시안대로 별도 패널 없이 배경과 서사만 보여줍니다.
export function KakaoCard({ scene }: { scene: SceneId }) {
  if (scene === "enter") return <FriendList animated />;
  if (scene === "choice") return <Profile />;
  if (scene === "actionA") return <PhotoViewer />;
  if (scene === "actionB") return null;
  return <FriendList animated={false} />;
}

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  listTitle: { color: t.text, fontFamily: t.sans, fontSize: 17, fontWeight: "600" },
  highlight: {
    paddingHorizontal: 12,
    marginHorizontal: -12,
    borderRadius: 14,
    backgroundColor: "rgba(245,239,227,0.06)",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  profileCenter: { alignItems: "center", gap: 8 },
  profilePhoto: { width: 108, height: 108, borderRadius: 44 },
  profileName: { fontSize: 16, marginTop: 4 },
  profileActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(245,239,227,0.1)",
  },
  viewer: { backgroundColor: "#0d0b08", padding: 12 },
  viewerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  viewerPhoto: { width: "100%", aspectRatio: 4 / 3, borderRadius: 10 },
  viewerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 4,
  },
});
