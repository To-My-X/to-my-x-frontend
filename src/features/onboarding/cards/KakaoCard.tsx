import { useEffect, useState } from "react";
import { Animated, Easing, Platform, StyleSheet, Text, View } from "react-native";
import { tokens as t } from "@/theme/tokens";
import { FadeIn } from "../fade-in";
import type { SceneId } from "../episodes";
import { Avatar, Photo, SceneCard, pieceStyles as p } from "./pieces";

const native = Platform.OS !== "web";
const friends = ["민서", "지우", "서연"];

// 02.01~02.05 카톡 에피소드 연출. 친구 목록이 살짝 흐르다 X의 프로필이 눈에 들어오는 장면입니다.
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
  const translateY = scroll.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  return (
    <SceneCard>
      <Text style={styles.header}>친구</Text>
      <Animated.View style={animated && { transform: [{ translateY }] }}>
        {friends.map((name) => (
          <View key={name} style={p.row}>
            <Avatar label={name[0]} />
            <Text style={p.name}>{name}</Text>
          </View>
        ))}
        <FadeIn delay={animated ? 1500 : 200} duration={900} rise={6}>
          <View style={[p.row, styles.highlight]}>
            <Avatar label="X" warm size={44} />
            <View>
              <Text style={p.name}>X</Text>
              <Text style={p.caption}>프로필 사진이 바뀌었어요</Text>
            </View>
          </View>
        </FadeIn>
      </Animated.View>
    </SceneCard>
  );
}

// 02.02 프로필 · 02.04 잠깐의 정지(흐려진 프로필)
function Profile({ paused }: { paused?: boolean }) {
  return (
    <SceneCard style={paused && { opacity: 0.45 }}>
      <FadeIn duration={1000}>
        <Photo style={styles.profilePhoto} />
      </FadeIn>
      <FadeIn delay={500}>
        <Text style={[p.name, styles.profileName]}>X</Text>
        <View style={styles.profileActions}>
          {["1:1 채팅", "통화하기", "페이스톡"].map((label) => (
            <Text key={label} style={p.caption}>
              {label}
            </Text>
          ))}
        </View>
      </FadeIn>
    </SceneCard>
  );
}

// 02.03 사진을 크게 본 장면
function PhotoViewer() {
  return (
    <SceneCard style={styles.viewer}>
      <View style={styles.viewerTop}>
        <Text style={p.caption}>‹</Text>
        <Text style={p.caption}>1/1</Text>
      </View>
      <FadeIn duration={1200} rise={0}>
        <Photo style={styles.viewerPhoto} />
      </FadeIn>
    </SceneCard>
  );
}

export function KakaoCard({ scene }: { scene: SceneId }) {
  if (scene === "enter") return <FriendList animated />;
  if (scene === "choice") return <Profile />;
  if (scene === "actionA") return <PhotoViewer />;
  if (scene === "actionB") return <Profile paused />;
  return <FriendList animated={false} />;
}

const styles = StyleSheet.create({
  header: { color: t.muted, fontFamily: t.sans, fontSize: 12, marginBottom: 16 },
  highlight: {
    marginTop: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.line,
    backgroundColor: "#262219",
  },
  profilePhoto: { height: 150 },
  profileName: { textAlign: "center", marginTop: 14, fontSize: 16 },
  profileActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: t.line,
  },
  viewer: { backgroundColor: "#121008" },
  viewerTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  viewerPhoto: { height: 190 },
});
