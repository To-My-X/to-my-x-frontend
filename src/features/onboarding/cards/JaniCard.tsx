import { StyleSheet, Text, View } from "react-native";
import { tokens as t } from "@/theme/tokens";
import { FadeIn } from "../fade-in";
import type { SceneId } from "../episodes";
import { Avatar, SceneCard, pieceStyles as p } from "./pieces";
import { useTyping } from "../use-typing";

// 02.11~02.15 자니 에피소드 연출. 새벽의 채팅 앱 장면입니다.
function ChatList() {
  const { typed, done } = useTyping("X", 700, 200);
  return (
    <SceneCard>
      <Text style={styles.header}>채팅</Text>
      <View style={styles.searchBar}>
        <Text style={p.caption}>⌕</Text>
        <Text style={p.name}>
          {typed}
          {!done && <Text style={p.caption}>|</Text>}
        </Text>
      </View>
      <FadeIn delay={1400} duration={1000}>
        <View style={p.row}>
          <Avatar label="X" warm size={44} />
          <View style={styles.preview}>
            <Text style={p.name}>X</Text>
            <Text style={p.caption}>잘 지내.</Text>
          </View>
          <Text style={p.caption}>오전 2:41</Text>
        </View>
      </FadeIn>
    </SceneCard>
  );
}

// 02.12 멈춰 있는 대화 · 02.13 보내기 직전("자니"를 썼다 지우는 자리)
function ChatRoom({ draft }: { draft?: boolean }) {
  const { typed, done } = useTyping(draft ? "자니" : "", 900, 260);
  return (
    <SceneCard>
      <View style={[p.row, styles.roomHeader]}>
        <Text style={p.caption}>‹</Text>
        <Text style={p.name}>X</Text>
      </View>
      <FadeIn duration={900}>
        <View style={[styles.bubble, styles.left]}>
          <Text style={p.name}>잘 지내.</Text>
        </View>
        <View style={[styles.bubble, styles.right]}>
          <Text style={p.name}>너도 잘 지내.</Text>
        </View>
        <Text style={[p.caption, styles.time]}>오전 2:41</Text>
      </FadeIn>
      <FadeIn delay={500}>
        <View style={styles.inputBar}>
          <Text style={draft && typed ? p.name : p.caption}>
            {draft ? typed : "메시지 입력"}
            {draft && !done && <Text style={p.caption}>|</Text>}
          </Text>
          <Text style={[p.caption, styles.send]}>↑</Text>
        </View>
      </FadeIn>
    </SceneCard>
  );
}

// 02.14 꺼진 화면 · 02.15 보내지 않은 새벽
function ScreenOff({ afterglow }: { afterglow?: boolean }) {
  return (
    <SceneCard style={styles.off}>
      <FadeIn delay={400} duration={1600} rise={0}>
        <Text style={styles.clock}>{afterglow ? "오전 2:47" : ""}</Text>
        <View style={styles.glow} />
      </FadeIn>
    </SceneCard>
  );
}

export function JaniCard({ scene }: { scene: SceneId }) {
  if (scene === "enter") return <ChatList />;
  if (scene === "choice") return <ChatRoom />;
  if (scene === "actionA") return <ChatRoom draft />;
  if (scene === "actionB") return <ScreenOff />;
  return <ScreenOff afterglow />;
}

const styles = StyleSheet.create({
  header: { color: t.muted, fontFamily: t.sans, fontSize: 12, marginBottom: 8 },
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
  preview: { flex: 1, gap: 2 },
  roomHeader: { paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: t.line },
  bubble: {
    maxWidth: "70%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginTop: 12,
  },
  left: { alignSelf: "flex-start", backgroundColor: "#2a261f" },
  right: { alignSelf: "flex-end", backgroundColor: "#3a3327" },
  time: { alignSelf: "flex-end", marginTop: 6 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 42,
    borderRadius: 21,
    paddingHorizontal: 16,
    backgroundColor: "#2a261f",
    marginTop: 16,
  },
  send: { fontSize: 16 },
  off: { height: 200, backgroundColor: "#0b0a08", justifyContent: "center", alignItems: "center" },
  clock: { color: "rgba(245,239,227,0.35)", fontFamily: t.sans, fontSize: 24, textAlign: "center", marginBottom: 14 },
  glow: { height: 1, width: 140, backgroundColor: "rgba(245,239,227,0.12)" },
});
