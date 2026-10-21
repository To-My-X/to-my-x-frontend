export type ScrollState = { y: number; anchor: number; direction: number; hidden: boolean };
export const initialScroll: ScrollState = { y: 0, anchor: 0, direction: 0, hidden: false };
export function updateScroll(previous: ScrollState, offset: number): ScrollState {
  const y = Math.max(0, offset);
  if (y === 0) return initialScroll;
  const direction = Math.sign(y - previous.y);
  if (!direction) return previous;
  const anchor = direction === previous.direction ? previous.anchor : previous.y;
  const distance = Math.abs(y - anchor);
  return { y, anchor, direction, hidden: direction > 0 && distance > 80 ? true : direction < 0 && distance >= 8 ? false : previous.hidden };
}
