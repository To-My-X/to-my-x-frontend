import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { FadeIn } from "../fade-in";
import type { SceneId } from "../episodes";
import { AppPanel, Avatar, photos, pieceStyles as p } from "./pieces";
import { useTyping } from "../use-typing";

function TabBar() {
  return (
    <View style={styles.tabBar}>
      <Text style={p.icon}>⌂</Text>
      <Text style={p.icon}>⌕</Text>
      <Text style={p.icon}>▦</Text>
      <Text style={p.icon}>♡</Text>
      <Avatar source={photos.portrait} size={20} round />
    </View>
  );
}

// 02.06 검색창. x.archive가 입력되면 계정이 떠오릅니다.
function Search() {
  const { typed, done } = useTyping("x.archive");
  return (
    <AppPanel>
      <View style={styles.searchBar}>
        <Text style={p.icon}>⌕</Text>
        <Text style={p.name}>
          {typed}
          {!done && <Text style={p.caption}>|</Text>}
        </Text>
      </View>
      <FadeIn delay={2200} duration={900}>
        <View style={p.row}>
          <Avatar source={photos.portrait} size={44} round />
          <View style={{ flex: 1 }}>
            <Text style={p.name}>x.archive</Text>
            <Text style={p.caption}>X</Text>
          </View>
          <Text style={p.icon}>×</Text>
        </View>
      </FadeIn>
      <TabBar />
    </AppPanel>
  );
}

// 02.07 계정 프로필. 최근 게시물 한 장이 새로 떠오릅니다.
function Account() {
  return (
    <AppPanel>
      <View style={styles.accountHeader}>
        <Text style={p.name}>x.archive</Text>
        <Text style={p.icon}>⋯</Text>
      </View>
      <View style={p.row}>
        <Avatar source={photos.portrait} size={52} round />
        <View style={styles.stats}>
          {(
            [
              ["24", "게시물"],
              ["218", "팔로워"],
              ["196", "팔로잉"],
            ] as const
          ).map(([value, label]) => (
            <View key={label} style={styles.stat}>
              <Text style={p.name}>{value}</Text>
              <Text style={p.caption}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={[p.caption, styles.bio]}>X · 작은 기록들</Text>
      <View style={styles.accountButtons}>
        <View style={styles.accountButton}>
          <Text style={p.caption}>팔로잉</Text>
        </View>
        <View style={styles.accountButton}>
          <Text style={p.caption}>메시지</Text>
        </View>
      </View>
      <Text style={[p.caption, styles.gridLabel]}>최근 게시물 · 사진 2장</Text>
      <View style={styles.grid}>
        <FadeIn delay={900} duration={1100} rise={0}>
          <Image
            source={photos.cafe}
            contentFit="cover"
            accessible={false}
            style={styles.cell}
          />
        </FadeIn>
        <Image
          source={photos.portrait}
          contentFit="cover"
          accessible={false}
          style={styles.cell}
        />
      </View>
      <TabBar />
    </AppPanel>
  );
}

// 02.08 게시물 보기. 두 번째 장의 잔이 두 개인 사진입니다.
function Post() {
  return (
    <AppPanel>
      <View style={styles.accountHeader}>
        <Text style={p.caption}>‹ 게시물</Text>
        <Text style={p.icon}>⋯</Text>
      </View>
      <View style={p.row}>
        <Avatar source={photos.portrait} size={30} round />
        <Text style={p.name}>x.archive</Text>
      </View>
      <FadeIn duration={1100} rise={0}>
        <Image
          source={photos.cafe}
          contentFit="cover"
          accessible={false}
          style={styles.postPhoto}
        />
      </FadeIn>
      <View style={styles.postActions}>
        <Text style={p.icon}>♡ ◯ ➤</Text>
        <Text style={p.caption}>2/2</Text>
        <Text style={p.icon}>⎙</Text>
      </View>
      <Text style={p.name}>x.archive 고마워</Text>
      <Text style={p.caption}>1일 전</Text>
    </AppPanel>
  );
}

// 02.09 검색 복귀와 02.10 여운은 시안대로 패널 없이 배경과 서사만 보여줍니다.
export function InstaCard({ scene }: { scene: SceneId }) {
  if (scene === "enter") return <Search />;
  if (scene === "choice") return <Account />;
  if (scene === "actionA") return <Post />;
  return null;
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 42,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#262219",
    marginBottom: 8,
  },
  accountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stats: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  stat: { alignItems: "center", gap: 2 },
  bio: { marginBottom: 10 },
  accountButtons: { flexDirection: "row", gap: 8, marginBottom: 12 },
  accountButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#262219",
  },
  gridLabel: { marginBottom: 6 },
  grid: { flexDirection: "row", gap: 3 },
  cell: { width: 96, aspectRatio: 1, borderRadius: 4 },
  postPhoto: { width: "100%", aspectRatio: 4 / 3, borderRadius: 8, marginTop: 6 },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(245,239,227,0.1)",
  },
});
