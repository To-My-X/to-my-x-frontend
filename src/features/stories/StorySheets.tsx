import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ActionButton } from "@/components/ui/feed-actions";
import { flowStyles as f } from "@/components/ui/flow-page";
import { useState } from "react";
import { Pressable, Text } from "react-native";

// 07.01~07.08 공유·숨기기·신고·차단 시트. 서버 저장 없이 화면 연결만 확인합니다.
export type SheetMode =
  | "share"
  | "copied"
  | "manage"
  | "hide"
  | "hidden"
  | "report"
  | "reported"
  | "block";
const reasons = [
  "개인정보가 드러나 있어요",
  "욕설·혐오 표현이 있어요",
  "광고·반복 게시글이에요",
  "기타",
];

export function StorySheets({
  storyId,
  mode,
  onChange,
  onClose,
}: {
  storyId: string;
  mode: SheetMode;
  onChange: (mode: SheetMode) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const copy = async () => {
    const origin =
      (globalThis as { location?: { origin: string } }).location?.origin ??
      "https://to-my-x.test";
    try {
      await (
        globalThis as {
          navigator?: {
            clipboard?: { writeText: (text: string) => Promise<void> };
          };
        }
      ).navigator?.clipboard?.writeText(`${origin}/stories/${storyId}`);
    } catch {
      /* 클립보드 미지원 환경은 안내만 유지 */
    }
    onChange("copied");
  };
  const mockNote = (
    <Text style={f.muted}>
      화면 연결 확인 단계로, 실제로 저장되지 않습니다.
    </Text>
  );
  return (
    <BottomSheet visible onClose={onClose}>
      {mode === "share" && (
        <>
          <Text accessibilityRole="header" style={f.title}>
            이 마음을 나누고 싶다면
          </Text>
          <Text style={f.muted}>
            글쓴이의 정보 없이, 공개된 이야기만 나눠요.
          </Text>
          <ActionButton label="이야기 링크 복사" onPress={() => void copy()} />
          <ActionButton label="닫기" onPress={onClose} />
        </>
      )}
      {mode === "copied" && (
        <>
          <Text accessibilityRole="header" style={f.title}>
            이야기 링크를 복사했어요.
          </Text>
          <Text style={f.muted}>대화창에 붙여 넣어 마음을 나눠보세요.</Text>
          <ActionButton label="확인" onPress={onClose} />
        </>
      )}
      {mode === "manage" && (
        <>
          <Text accessibilityRole="header" style={f.title}>
            이 이야기
          </Text>
          <ActionButton
            label="이 이야기 숨기기"
            onPress={() => onChange("hide")}
          />
          <ActionButton
            label="이 이야기 신고하기"
            onPress={() => onChange("report")}
          />
          <ActionButton
            label="이 작성자 차단하기"
            onPress={() => onChange("block")}
          />
          <ActionButton label="닫기" onPress={onClose} />
        </>
      )}
      {mode === "hide" && (
        <>
          <Text accessibilityRole="header" style={f.title}>
            이 이야기를{"\n"}숨길까요?
          </Text>
          <Text style={f.muted}>
            이 이야기가 내 스토리 목록에서 사라져요.{"\n"}글쓴이에게는 알려지지
            않아요.
          </Text>
          {mockNote}
          <ActionButton label="숨기기" onPress={() => onChange("hidden")} />
          <ActionButton label="취소" onPress={onClose} />
        </>
      )}
      {mode === "hidden" && (
        <>
          <Text accessibilityRole="header" style={f.title}>
            이 이야기를 숨겼어요.
          </Text>
          <Text style={f.muted}>다른 X의 마음을 만나보세요.</Text>
          <ActionButton label="다른 이야기 보기" onPress={onClose} />
        </>
      )}
      {mode === "report" && (
        <>
          <Text accessibilityRole="header" style={f.title}>
            신고하는 이유를{"\n"}알려주세요.
          </Text>
          <Text style={f.muted}>신고한 사람의 정보는 전달되지 않아요.</Text>
          {reasons.map((label) => (
            <Pressable
              key={label}
              accessibilityRole="radio"
              accessibilityState={{ selected: reason === label }}
              onPress={() => setReason(label)}
              style={{ paddingVertical: 10 }}
            >
              <Text style={f.text}>
                {reason === label ? "●" : "○"} {label}
              </Text>
            </Pressable>
          ))}
          {mockNote}
          <ActionButton
            label="신고 접수하기"
            disabled={!reason}
            onPress={() => onChange("reported")}
          />
          <ActionButton label="닫기" onPress={onClose} />
        </>
      )}
      {mode === "reported" && (
        <>
          <Text accessibilityRole="header" style={f.title}>
            신고가 잘 접수됐어요.
          </Text>
          <Text style={f.muted}>
            보내 주신 내용을 확인한 뒤{"\n"}필요한 조치를 할게요.
          </Text>
          <ActionButton label="스토리로 돌아가기" onPress={onClose} />
        </>
      )}
      {mode === "block" && (
        <>
          <Text accessibilityRole="header" style={f.title}>
            이 작성자를{"\n"}차단할까요?
          </Text>
          <Text style={f.muted}>
            이 작성자의 이야기가 목록에서 숨겨져요.{"\n"}차단 사실은 상대에게
            알려지지 않아요.
          </Text>
          {mockNote}
          <ActionButton label="차단하기" onPress={onClose} />
          <ActionButton label="취소" onPress={onClose} />
        </>
      )}
    </BottomSheet>
  );
}
