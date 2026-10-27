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
      <View style={styles.searchLine}>
        <Text style={p.name}>
          {typed}
          {!done && <Text style={p.caption}>|</Text>}
        </Text>
      </View>
      <Text style={[p.caption, styles.section]}>채팅방</Text>
      <FadeIn delay={1400} duration={1000}>
        <View style={p.row}>
          <Avatar source={photos.portrait} size={46} />
          <View style={{ flex: 1 }}>
            <Text style={p.name}>X</Text>
            <Text style={p.caption}>너도 잘 지내.</Text>
          </View>
          <Text style={p.caption}>오래전</Text>
        </View>
      </FadeIn>
      <Text style={[p.caption, styles.clock]}>오전 2:47</Text>
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
      {draft ? (
        <View style={[styles.bubble, styles.mine, styles.draftLast]}>
          <Text style={p.name}>너도 잘 지내.</Text>
        </View>
      ) : (
        <FadeIn duration={900}>
          <Text style={[p.caption, styles.section, { textAlign: "center" }]}>
            마지막 대화
          </Text>
          <View style={styles.theirRow}>
            <Avatar source={photos.portrait} size={30} />
            <View style={[styles.bubble, styles.theirs]}>
              <Text style={p.name}>잘 지내.</Text>
            </View>
          </View>
          <View style={[styles.bubble, styles.mine]}>
            <Text style={p.name}>너도 잘 지내.</Text>
          </View>
        </FadeIn>
      )}
      <FadeIn delay={draft ? 300 : 500}>
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
            <Text style={styles.emoji}>😌</Text>
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
            <Text style={styles.keyRow}>
              123{"   "}한/영{"   "}스페이스{"   "}줄바꿈
            </Text>
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
    marginBottom: 12,
  },
  listTitle: {
    color: t.text,
    fontFamily: t.sans,
    fontSize: 17,
    fontWeight: "600",
  },
  searchLine: {
    minHeight: 34,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(245,239,227,0.14)",
    marginBottom: 12,
  },
  section: { marginBottom: 4 },
  clock: { textAlign: "center", marginTop: 26, marginBottom: 6 },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    marginBottom: 10,
  },
  theirRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  bubble: {
    maxWidth: "70%",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  theirs: { alignSelf: "flex-start", backgroundColor: "#262219" },
  mine: { alignSelf: "flex-end", backgroundColor: "#3f3a30", marginTop: 10 },
  draftLast: { marginBottom: 34 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 42,
    borderRadius: 21,
    paddingHorizontal: 14,
    backgroundColor: "#211d17",
    marginTop: 16,
  },
  emoji: { fontSize: 15 },
  send: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#4a443a",
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: { color: t.text, fontSize: 15, fontWeight: "700" },
  keyboard: {
    marginTop: 14,
    gap: 10,
    paddingVertical: 12,
    borderRadius: 10,
  },
  keyRow: {
    color: "#d8d0c0",
    fontFamily: t.sans,
    fontSize: 13,
    letterSpacing: 2,
    textAlign: "center",
  },
});
