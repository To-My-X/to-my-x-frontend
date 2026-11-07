// 게스트가 공감·신고·차단을 누르고 로그인한 뒤 원래 대상으로 복귀하기 위한 1회성 의도.
// 웹은 카카오 리다이렉트로 페이지가 새로 뜨므로 sessionStorage, 네이티브는 메모리를 사용합니다.
// 공감은 로그인 후 원래 목표 상태를 1회 적용하고, 신고·차단은 해당 시트를 다시 열기만 합니다(자동 접수 금지).
export type PendingIntent = {
  type: "reaction" | "report" | "block";
  postId: string;
};

const key = "tomyx.intent.v1";
let memory: PendingIntent | null = null;

type WebStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};
const session = (): WebStorage | null =>
  (globalThis as { sessionStorage?: WebStorage }).sessionStorage ?? null;

export function setPendingIntent(intent: PendingIntent) {
  memory = intent;
  try {
    session()?.setItem(key, JSON.stringify(intent));
  } catch {
    // 저장 실패 시 메모리로만 유지합니다.
  }
}

export function consumePendingIntent(): PendingIntent | null {
  let intent = memory;
  try {
    const raw = session()?.getItem(key);
    if (raw) {
      const data = JSON.parse(raw) as Partial<PendingIntent>;
      if (
        (data.type === "reaction" ||
          data.type === "report" ||
          data.type === "block") &&
        typeof data.postId === "string"
      )
        intent = { type: data.type, postId: data.postId };
    }
    session()?.removeItem(key);
  } catch {
    // 손상값은 무시합니다.
  }
  memory = null;
  return intent;
}
