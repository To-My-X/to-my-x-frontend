import { tokens as t } from "@/theme/tokens";
import { useLayoutEffect, useRef } from "react";
import { limitBody } from "./body-rules";
import { useWritingSession } from "./writing-session";

// 웹 IME 조합 중에는 자르지 않고 조합 완료 시 사용자 인식 문자 기준으로 제한합니다.
export function BodyInput() {
  const { draft, update } = useWritingSession();
  const ref = useRef<HTMLTextAreaElement>(null);
  const composing = useRef(false);
  useLayoutEffect(() => {
    if (!ref.current || composing.current) return;
    if (
      ref.current.selectionStart !== draft.selection.start ||
      ref.current.selectionEnd !== draft.selection.end
    ) {
      ref.current.setSelectionRange(draft.selection.start, draft.selection.end);
    }
    ref.current.scrollTop = draft.scrollY;
  }, [draft.selection, draft.scrollY]);
  return (
    <textarea
      ref={ref}
      aria-label="이야기 본문"
      value={draft.body}
      onCompositionStart={() => {
        composing.current = true;
      }}
      onCompositionEnd={(event) => {
        composing.current = false;
        update({ body: limitBody(event.currentTarget.value) });
      }}
      onChange={(event) =>
        update({
          body: composing.current
            ? event.target.value
            : limitBody(event.target.value),
        })
      }
      onSelect={(event) =>
        update({
          selection: {
            start: event.currentTarget.selectionStart,
            end: event.currentTarget.selectionEnd,
          },
        })
      }
      onScroll={(event) => update({ scrollY: event.currentTarget.scrollTop })}
      placeholder="그 사람에게 전하고 싶은 말이 있나요?"
      style={{
        boxSizing: "border-box",
        width: "100%",
        height: 300,
        resize: "none",
        padding: 16,
        border: `1px solid ${t.line}`,
        borderRadius: 12,
        color: t.text,
        background: "transparent",
        fontFamily: t.serif,
        fontSize: 17,
        lineHeight: "29px",
      }}
    />
  );
}
