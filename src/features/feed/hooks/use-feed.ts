import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createMockFeed } from '../api/mock-feed';
import type { FeedScenario, Story } from '../types';

export function useFeed(scenario: FeedScenario) {
  const request = useMemo(() => createMockFeed(scenario), [scenario]);
  const [items, setItems] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [next, setNext] = useState<number | null>(0);
  const active = useRef<AbortController | null>(null);
  const load = useCallback((cursor: number) => {
    if (active.current) return;
    const controller = new AbortController();
    active.current = controller;
    void request(cursor, controller.signal).then(page => {
      if (controller.signal.aborted) return;
      setItems(previous => cursor === 0 ? page.items : [...previous, ...page.items.filter(item => !previous.some(old => old.id === item.id))]);
      setNext(page.next);
    }).catch(() => {
      if (!controller.signal.aborted) setError(true);
    }).finally(() => {
      if (!controller.signal.aborted) { active.current = null; setLoading(false); }
    });
  }, [request]);
  useEffect(() => {
    void load(0);
    return () => { active.current?.abort(); active.current = null; };
  }, [load]);
  const loadNext = () => {
    if (next === null || active.current) return;
    setLoading(true); setError(false); void load(next);
  };
  return { items, loading, error, retry: loadNext, loadMore: () => { if (!error && !loading) loadNext(); } };
}
