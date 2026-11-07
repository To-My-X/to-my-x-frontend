import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ActionButton } from "@/components/ui/feed-actions";
import { flowStyles as f } from "@/components/ui/flow-page";
import { ApiError } from "@/lib/api";
import type { ReportReason } from "@/features/posts/types";
import { useState } from "react";
import { Pressable, Text } from "react-native";

// 07.01~07.08 공유·숨기기·신고·차단 시트. 실제 저장 동작은 라우트가 actions로 주입합니다.
export type SheetMode =
  | "share"
  | "copied"
  | "manage"
  | "hide"
  | "hidden"
  | "report"
  | "reported"
  | "block";

export type SheetActions = {
  // 게스트는 로컬 저장, 로그인 사용자는 서버 저장을 라우트가 구현합니다.
  hide: () => Promise<void>;
  report: (reason: ReportReason) => Promise<{ alreadyReported: boolean }>;
  block: () => Promise<void>;
};

const reasons: { code: ReportReason; label: string }[] = [
  { code: "PRIVACY", label: "개인정보가 드러나 있어요" },
  { code: "ABUSE", label: "욕설·혐오 표현이 있어요" },
  { code: "SPAM", label: "광고·반복 게시글이에요" },
  { code: "OTHER", label: "기타" },
];

const errorText = (error: unknown) => {
  if (error instanceof ApiError) {
    if (error.retryAfter)
      return `${error.message} ${error.retryAfter}초 뒤에 다시 시도할 수 있어요.`;
    return error.message;
  }
  return "요청하지 못했어요. 연결을 확인하고 다시 시도해 주세요.";
};

export function StorySheets({
  storyId,
  shareUrl,
  mode,
  guest = false,
  onRequireLogin,
  actions,
  onChange,
  onClose,
}: {
  storyId: string;
  shareUrl?: string;
  mode: SheetMode;
  // 게스트의 신고·차단은 로그인(08.03)부터 진행하고, 숨김은 로컬 저장을 허용합니다.
  guest?: boolean;
  onRequireLogin?: (intent: "report" | "block") => void;
  actions?: SheetActions;
  onChange: (mode: SheetMode) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyReported, setAlreadyReported] = useState(false);
  const run = (
    task: (() => Promise<void>) | undefined,
    onDone: () => void,
  ) => {
    if (!task || busy) return;
    setBusy(true);
    setError(null);
    task()
      .then(() => {
        setBusy(false);
        onDone();
      })
      .catch((cause) => {
        // 실패는 현재 시트와 선택을 보존합니다(07.04/07.06 규칙).
        setBusy(false);
        setError(errorText(cause));
      });
  };
  const copy = async () => {
    const origin =
      (globalThis as { location?: { origin: string } }).location?.origin ??
      "https://to-my-x.expo.app";
    const url = shareUrl ?? `${origin}/stories/${storyId}`;
    try {
      await (
        globalThis as {
          navigator?: {
            clipboard?: { writeText: (text: string) => Promise<void> };
          };
        }
      ).navigator?.clipboard?.writeText(url);
      onChange("copied");
    } catch {
      setError(`링크를 복사하지 못했어요. 주소: ${url}`);
    }
  };
  const failure = error && (
    <Text accessibilityRole="alert" style={f.text}>
      {error}
    </Text>
  );
  return (
    <BottomSheet visible onClose={busy ? () => {} : onClose}>
      {mode === "share" && (
        <>
          <Text accessibilityRole="header" style={f.title}>
            이 마음을 나누고 싶다면
          </Text>
          <Text style={f.muted}>
            글쓴이의 정보 없이, 공개된 이야기만 나눠요.
          </Text>
          {failure}
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
            onPress={() =>
              guest ? onRequireLogin?.("report") : onChange("report")
            }
          />
          <ActionButton
            label="이 작성자 차단하기"
            onPress={() =>
              guest ? onRequireLogin?.("block") : onChange("block")
            }
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
          {failure}
          <ActionButton
            label={busy ? "숨기는 중…" : "숨기기"}
            disabled={busy}
            onPress={() => run(actions?.hide, () => onChange("hidden"))}
          />
          <ActionButton label="취소" disabled={busy} onPress={onClose} />
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
          {reasons.map((item) => (
            <Pressable
              key={item.code}
              accessibilityRole="radio"
              accessibilityState={{ selected: reason === item.code }}
              onPress={() => setReason(item.code)}
              style={{ paddingVertical: 10 }}
            >
              <Text style={f.text}>
                {reason === item.code ? "●" : "○"} {item.label}
              </Text>
            </Pressable>
          ))}
          {failure}
          <ActionButton
            label={busy ? "접수하는 중…" : "신고 접수하기"}
            disabled={!reason || busy}
            onPress={() =>
              reason &&
              run(
                actions &&
                  (async () => {
                    const receipt = await actions.report(reason);
                    setAlreadyReported(receipt.alreadyReported);
                  }),
                () => onChange("reported"),
              )
            }
          />
          <ActionButton label="닫기" disabled={busy} onPress={onClose} />
        </>
      )}
      {mode === "reported" && (
        <>
          <Text accessibilityRole="header" style={f.title}>
            {alreadyReported
              ? "이미 접수된 신고예요."
              : "신고가 잘 접수됐어요."}
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
          {failure}
          <ActionButton
            label={busy ? "차단하는 중…" : "차단하기"}
            disabled={busy}
            onPress={() => run(actions?.block, onClose)}
          />
          <ActionButton label="취소" disabled={busy} onPress={onClose} />
        </>
      )}
    </BottomSheet>
  );
}
