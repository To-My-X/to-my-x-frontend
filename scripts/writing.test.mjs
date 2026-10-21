import assert from 'node:assert/strict';
import { test } from 'node:test';
import { characters, validBody, summarize, limitBody } from '../src/features/writing/body-rules.ts';
test('body validity uses graphemes and rejects blank input', () => {
  for (const value of ['', ' \n\t']) assert.equal(validBody(value), false);
  for (const length of [999, 1000]) assert.equal(validBody('가'.repeat(length)), true);
  assert.equal(validBody('가'.repeat(1001)), false);
  assert.equal(characters('👨‍👩‍👧‍👦가').length, 2);
  assert.equal(characters(limitBody('👨‍👩‍👧‍👦'.repeat(1001))).length, 1000);
});
test('summary normalizes whitespace without changing the body', () => {
  const body = '  안녕\n  오랜만이야  ';
  assert.equal(summarize(body), '안녕 오랜만이야');
  for (const n of [19, 20]) assert.equal(summarize('가'.repeat(n)), '가'.repeat(n));
  assert.equal(summarize('가'.repeat(21)), '가'.repeat(20) + '…');
  assert.equal(body, '  안녕\n  오랜만이야  ');
});
