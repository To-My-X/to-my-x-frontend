import assert from 'node:assert/strict';
import { test } from 'node:test';
import { initialScroll, updateScroll } from '../src/features/feed/scroll-controls.ts';
import { createMockFeed } from '../src/features/feed/api/mock-feed.ts';

test('controls hide beyond 80px and restore at 8px upward or top', () => {
  let state = updateScroll(initialScroll, 80);
  assert.equal(state.hidden, false);
  state = updateScroll(state, 81);
  assert.equal(state.hidden, true);
  state = updateScroll(state, 74);
  assert.equal(state.hidden, true);
  state = updateScroll(state, 73);
  assert.equal(state.hidden, false);
  state = updateScroll(state, 154);
  assert.equal(state.hidden, true);
  assert.deepEqual(updateScroll(state, -10), initialScroll);
});
test('direction reversal resets distance and unchanged offsets retain state', () => {
  let state = updateScroll(initialScroll, 60);
  state = updateScroll(state, 55);
  state = updateScroll(state, 130);
  assert.equal(state.hidden, false);
  assert.equal(updateScroll(state, 130), state);
  assert.equal(updateScroll(state, 136).hidden, true);
});
test('mock pagination has 60 distinct stories and a terminal cursor', async () => {
  const fetch = createMockFeed('normal', 0);
  const signal = new AbortController().signal;
  let cursor = 0;
  const ids = [];
  do { const page = await fetch(cursor, signal); ids.push(...page.items.map(x => x.id)); cursor = page.next; } while (cursor !== null);
  assert.equal(ids.length, 60); assert.equal(new Set(ids).size, 60);
});
test('initial and pagination errors recover with the same cursor', async () => {
  for (const [scenario, cursor] of [['error', 0], ['pagination-error', 20]]) {
    const fetch = createMockFeed(scenario, 0);
    const signal = new AbortController().signal;
    await assert.rejects(fetch(cursor, signal));
    const page = await fetch(cursor, signal);
    assert.equal(page.items.length, 20);
    assert.equal(page.items[0].id, `mock-${cursor}`);
  }
});
test('empty, long text and cancellation remain distinct', async () => {
  const controller = new AbortController();
  assert.deepEqual(await createMockFeed('empty', 0)(0, controller.signal), { items: [], next: null });
  assert.ok((await createMockFeed('long-text', 0)(0, controller.signal)).items[0].body.split('\n\n').length === 12);
  const loading = createMockFeed('loading')(0, controller.signal);
  controller.abort();
  await assert.rejects(loading, /aborted/);
  await assert.rejects(createMockFeed('normal')(0, controller.signal), /aborted/);
});
