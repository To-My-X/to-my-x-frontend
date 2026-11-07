// 등록 시도·탈퇴 등 멱등 요청에 쓰는 클라이언트 생성 ID입니다.
// 보안 토큰이 아니라 중복 방지용 식별자라 난수 품질 요구가 낮습니다.
export const randomId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
