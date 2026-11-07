import { useCallback, useEffect, useRef, useState } from "react";
import type { FeedPage, Story } from "../types";

export type FeedLoader = (
  cursor: string | null,
  signal?: AbortSignal,
) => Promise<FeedPage>;

// 커서 목록 상태. 같은 ID는 중복 표시하지 않고 추가 조회 실패는 기존 목록을 보존합니다.
export function useFeed(loader: FeedLoader) {
  const [items, setItems] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [next, setNext] = useState<string | null>(null);
  const active = useRef<AbortController | null>(null);
  const load = useCallback(
    (cursor: string | null) => {
      if (active.current) return;
      const controller = new AbortController();
      active.current = controller;
      void loader(cursor, controller.signal)
        .then((page) => {
          if (controller.signal.aborted) return;
          setItems((previous) =>
            cursor === null
              ? page.items
              : [
                  ...previous,
                  ...page.items.filter(
                    (item) => !previous.some((old) => old.id === item.id),
                  ),
                ],
          );
          setNext(page.next);
        })
        .catch(() => {
          if (!controller.signal.aborted) setError(true);
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            active.current = null;
            setLoading(false);
          }
        });
    },
    [loader],
  );
  useEffect(() => {
    let cancelled = false;
    // 렌더 중 연쇄를 피하려고 초기화·첫 조회를 마이크로태스크로 미룹니다(react-hooks/set-state-in-effect).
    queueMicrotask(() => {
      if (cancelled) return;
      setItems([]);
      setNext(null);
      setError(false);
      setLoading(true);
      load(null);
    });
    return () => {
      cancelled = true;
      active.current?.abort();
      active.current = null;
    };
  }, [load]);
  const loadNext = (cursor: string | null) => {
    if (active.current) return;
    setLoading(true);
    setError(false);
    void load(cursor);
  };
  return {
    items,
    loading,
    error,
    retry: () => loadNext(items.length === 0 ? null : next),
    loadMore: () => {
      if (!error && !loading && next !== null) loadNext(next);
    },
    // 등록·숨김·차단 성공 뒤 목록 무효화와 공감 결과 반영에 사용합니다.
    reload: () => {
      active.current?.abort();
      active.current = null;
      setItems([]);
      setNext(null);
      setError(false);
      setLoading(true);
      void load(null);
    },
    updateItem: (id: string, patch: Partial<Story>) =>
      setItems((previous) =>
        previous.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      ),
    removeItem: (id: string) =>
      setItems((previous) => previous.filter((item) => item.id !== id)),
  };
}
export type Feed = ReturnType<typeof useFeed>;
