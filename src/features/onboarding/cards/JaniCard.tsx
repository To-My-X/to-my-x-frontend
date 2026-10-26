import { StyleSheet, Text, View } from "react-native";
import { tokens as t } from "@/theme/tokens";
import { FadeIn } from "../fade-in";
import type { SceneId } from "../episodes";
import { AppPanel, Avatar, photos, pieceStyles as p } from "./pieces";
import { useTyping } from "../use-typing";

// 02.11 채팅 목록. 검색에 X를 입력하면 그 사람의 방이 떠오릅니다.
function ChatList() {
  const { typed, done } = useTyping("X", 700, 220);
  return (
    <AppPanel>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>채팅</Text>
        <Text style={p.icon}>⌕ ＋</Text>
      </View>
      <View style={styles.searchBar}>
        <Text style={p.icon}>⌕</Text>
        <Text style={p.name}>
          {typed}
          {!done && <Text style={p.caption}>|</Text>}
        </Text>
      </View>
      <FadeIn delay={1400} duration={1000}>
        <View style={p.row}>
          <Avatar source={photos.portrait} size={46} />
          <View style={{ flex: 1 }}>
            <Text style={p.name}>X</Text>
            <Text style={p.caption}>너도 잘 지내.</Text>
          </View>
          <Text style={p.caption}>오전 2:47</Text>
        </View>
      </FadeIn>
    </AppPanel>
  );
}

// 02.12 멈춰 있는 대화 · 02.13 보내기 직전("자니"와 연출용 키보드)
function ChatRoom({ draft }: { draft?: boolean }) {
  const { typed, done } = useTyping(draft ? "자니" : "", 900, 280);
  return (
    <AppPanel>
      <View style={styles.roomHeader}>
        <Text style={p.icon}>‹</Text>
        <Text style={p.name}>X</Text>
        <Text style={p.icon}>⌕ ≡</Text>
      </View>
      <FadeIn duration={900}>
        <View style={styles.theirRow}>
          <Avatar source={photos.portrait} size={30} />
          <View style={[styles.bubble, styles.left]}>
            <Text style={p.name}>잘 지내.</Text>
          </View>
        </View>
        <View style={[styles.bubble, styles.right]}>
          <Text style={styles.myText}>너도 잘 지내.</Text>
        </View>
        <Text style={[p.caption, styles.time]}>오전 2:47</Text>
      </FadeIn>
      <FadeIn delay={400}>
        <View style={styles.inputBar}>
          <Text style={p.icon}>＋</Text>
          <Text style={[draft && typed ? p.name : p.caption, { flex: 1 }]}>
            {draft ? typed : "메시지 입력"}
            {draft && !done && <Text style={p.caption}>|</Text>}
          </Text>
          {draft ? (
            <View style={styles.send}>
              <Text style={styles.sendIcon}>↑</Text>
            </View>
          ) : (
            <Text style={p.icon}>☺</Text>
          )}
        </View>
      </FadeIn>
      {draft && (
        <FadeIn delay={700} rise={14}>
          <View style={styles.keyboard}>
            {[
              "ㅂ ㅈ ㄷ ㄱ ㅅ ㅛ ㅕ ㅑ ㅐ ㅔ",
              "ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ",
              "⇧ ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ ⌫",
            ].map((row) => (
              <Text key={row} style={styles.keyRow}>
                {row}
              </Text>
            ))}
            <Text style={styles.keyRow}>123{"   "}한/영{"   "}스페이스{"   "}줄바꿈</Text>
          </View>
        </FadeIn>
      )}
    </AppPanel>
  );
}

// 02.14 꺼진 화면과 02.15 여운은 시안대로 패널 없이 배경과 서사만 보여줍니다.
export function JaniCard({ scene }: { scene: SceneId }) {
  if (scene === "enter") return <ChatList />;
  if (scene === "choice") return <ChatRoom />;
  if (scene === "actionA") return <ChatRoom draft />;
  return null;
}

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  listTitle: { color: t.text, fontFamily: t.sans, fontSize: 17, fontWeight: "600" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 40,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#262219",
    marginBottom: 6,
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(245,239,227,0.1)",
  },
  theirRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginTop: 14 },
  bubble: {
    maxWidth: "70%",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  left: { alignSelf: "flex-start", backgroundColor: "#262219" },
  right: { alignSelf: "flex-end", backgroundColor: t.text, marginTop: 10 },
  myText: { color: "#1b1813", fontFamily: t.sans, fontSize: 14 },
  time: { alignSelf: "flex-end", marginTop: 6 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 42,
    borderRadius: 21,
    paddingHorizontal: 14,
    backgroundColor: "#262219",
    marginTop: 14,
  },
  send: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: t.text,
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: { color: "#1b1813", fontSize: 15, fontWeight: "700" },
  keyboard: { marginTop: 12, gap: 8, paddingVertical: 10, borderRadius: 10, backgroundColor: "#1d1a14" },
  keyRow: {
    color: t.muted,
    fontFamily: t.sans,
    fontSize: 13,
    letterSpacing: 2,
    textAlign: "center",
  },
});
