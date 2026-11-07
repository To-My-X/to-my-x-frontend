// 등록·차단 성공처럼 피드 전체를 무효화해야 하는 변경을 알리는 최소 구독 채널.
// 피드 화면이 떠 있지 않으면 구독자가 없고, 다음 마운트에서 새로 조회하므로 충분합니다.
const listeners = new Set<() => void>();

export function invalidateFeed() {
  for (const listener of listeners) listener();
}

export function subscribeFeedInvalidation(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
