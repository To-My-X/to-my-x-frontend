const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });
export const characters = (body: string) => Array.from(segmenter.segment(body), part => part.segment);
export const validBody = (body: string) => body.trim().length > 0 && characters(body).length <= 1000;
export function summarize(body: string) {
  const parts = characters(body.trim().replace(/\s+/g, ' '));
  return parts.slice(0, 20).join('') + (parts.length > 20 ? '…' : '');
}
export const limitBody = (body: string) => characters(body).slice(0, 1000).join('');
