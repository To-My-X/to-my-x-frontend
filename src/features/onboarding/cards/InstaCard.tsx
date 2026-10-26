import { StyleSheet, Text, View } from "react-native";
import { FadeIn } from "../fade-in";
import type { SceneId } from "../episodes";
import { Avatar, Photo, SceneCard, pieceStyles as p } from "./pieces";
import { useTyping } from "../use-typing";

// 02.06~02.10 인스타 에피소드 연출.
function Search({ dimmed }: { dimmed?: boolean }) {
  const { typed, done } = useTyping(dimmed ? "" : "x.archive");
  return (
    <SceneCard style={dimmed && { opacity: 0.5 }}>
      <View style={styles.searchBar}>
        <Text style={p.caption}>⌕</Text>
        <Text style={p.name}>
          {dimmed ? "x.archive" : typed}
          {!dimmed && !done && <Text style={p.caption}>|</Text>}
        </Text>
      </View>
      <FadeIn delay={dimmed ? 200 : 2200} duration={900}>
        <View style={p.row}>
          <Avatar label="x" warm />
          <View>
            <Text style={p.name}>x.archive</Text>
            <Text style={p.caption}>X · 작은 기록들</Text>
          </View>
        </View>
      </FadeIn>
    </SceneCard>
  );
}

// 02.07 계정 프로필. 그리드에 최근 게시물 한 장이 새로 떠오릅니다.
function Account() {
  return (
    <SceneCard>
      <View style={p.row}>
        <Avatar label="x" warm size={48} />
        <View style={styles.stats}>
          {(
            [
              ["24", "게시물"],
              ["218", "팔로워"],
              ["96", "팔로잉"],
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
      <View style={styles.grid}>
        <FadeIn delay={900} duration={1100} rise={0}>
          <Photo style={styles.cell} />
        </FadeIn>
        {Array.from({ length: 5 }, (_, index) => (
          <View key={index} style={[styles.cell, styles.oldCell]} />
        ))}
      </View>
    </SceneCard>
  );
}

// 02.08 게시물 보기. 사진 두 번째 장(잔이 두 개)을 보는 장면입니다.
function Post() {
  return (
    <SceneCard>
      <View style={p.row}>
        <Avatar label="x" warm size={32} />
        <Text style={p.name}>x.archive</Text>
        <Text style={[p.caption, styles.time]}>1시간 전</Text>
      </View>
      <FadeIn duration={1100} rise={0}>
        <Photo style={styles.postPhoto} />
      </FadeIn>
      <Text style={[p.caption, styles.pager]}>2/2</Text>
    </SceneCard>
  );
}

// 02.10 화면을 덮은 뒤
function Closed() {
  return (
    <SceneCard style={styles.closed}>
      <FadeIn delay={400} duration={1400} rise={0}>
        <View style={styles.glow} />
      </FadeIn>
    </SceneCard>
  );
}

export function InstaCard({ scene }: { scene: SceneId }) {
  if (scene === "enter") return <Search />;
  if (scene === "choice") return <Account />;
  if (scene === "actionA") return <Post />;
  if (scene === "actionB") return <Search dimmed />;
  return <Closed />;
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 42,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#2a261f",
    marginBottom: 10,
  },
  stats: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  stat: { alignItems: "center", gap: 2 },
  bio: { marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  cell: { width: "32%", aspectRatio: 1, borderRadius: 6 },
  oldCell: { backgroundColor: "#2a261f" },
  time: { marginLeft: "auto" },
  postPhoto: { height: 170, marginTop: 6 },
  pager: { textAlign: "center", marginTop: 10 },
  closed: { height: 200, backgroundColor: "#0e0c09", justifyContent: "center" },
  glow: { height: 1, marginHorizontal: 30, backgroundColor: "rgba(245,239,227,0.14)" },
});
