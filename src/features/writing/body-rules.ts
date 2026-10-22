// Hermes에는 Intl.Segmenter가 없어 코드 포인트로 폴백합니다. ZWJ 조합 이모지는 네이티브에서 더 길게 계산돼 제한이 더 엄격해질 뿐 초과를 허용하지는 않습니다.
const segmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter('ko', { granularity: 'grapheme' }) : null;
export const characters = (body: string) => segmenter ? Array.from(segmenter.segment(body), part => part.segment) : Array.from(body);
export const validBody = (body: string) => body.trim().length > 0 && characters(body).length <= 1000;
export function summarize(body: string) {
  const parts = characters(body.trim().replace(/\s+/g, ' '));
  return parts.slice(0, 20).join('') + (parts.length > 20 ? '…' : '');
}
export const limitBody = (body: string) => characters(body).slice(0, 1000).join('');
