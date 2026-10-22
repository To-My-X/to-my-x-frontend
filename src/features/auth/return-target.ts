// 로그인·동의 뒤 복귀 대상. URL에는 본문 데이터 대신 허용된 키만 노출합니다.
export const returnTargets = {
  write: "/write",
  my: "/my",
  notifications: "/notifications",
  settings: "/settings",
  feed: "/",
} as const;
export type ReturnKey = keyof typeof returnTargets;
export const resolveReturn = (key: string | undefined) =>
  returnTargets[key as ReturnKey] ?? returnTargets.write;
