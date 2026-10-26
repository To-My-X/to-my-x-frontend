import assert from 'node:assert/strict';
import { test } from 'node:test';
import { episodeIds, episodes } from '../src/features/onboarding/episodes.ts';

test('every episode has the five scenes and valid transitions', () => {
  for (const episode of episodeIds) {
    const scenes = episodes[episode];
    assert.deepEqual(Object.keys(scenes).sort(), ['actionA', 'actionB', 'afterglow', 'choice', 'enter']);
    for (const scene of Object.values(scenes)) {
      assert.ok(scene.ctas.length > 0 && scene.title && scene.lines.length > 0, `${scene.screen} content`);
      for (const cta of scene.ctas) assert.ok(cta.to === 'write' || scenes[cta.to], `${scene.screen} → ${cta.to}`);
    }
    assert.equal(scenes.enter.ctas[0].to, 'choice');
    assert.deepEqual(scenes.choice.ctas.map(cta => cta.to), ['actionA', 'actionB']);
    assert.equal(scenes.actionA.ctas[0].to, 'afterglow');
    for (const scene of [scenes.actionB, scenes.afterglow]) {
      assert.deepEqual(scene.ctas, [{ label: '이 마음 남기기', to: 'write' }]);
      assert.equal(scene.prompt, true);
    }
  }
});

test("progress persists, rejects corrupt data, rebuilds back path", async () => {
  const { loadProgress, saveProgress, historyFor } = await import(
    "../src/features/onboarding/progress.ts"
  );
  // Node 25의 내장 localStorage는 백업 파일 없이는 동작하지 않으므로 메모리 경로를 검증합니다.
  Object.defineProperty(globalThis, "localStorage", {
    value: undefined,
    configurable: true,
    writable: true,
  });
  assert.equal(loadProgress(), null);
  for (const episode of episodeIds)
    for (const scene of Object.keys(episodes[episode])) {
      saveProgress({ episode, scene, done: false });
      assert.deepEqual(
        loadProgress(),
        { episode, scene, done: false },
        `${episode}/${scene} roundtrip`,
      );
    }
  globalThis.localStorage = {
    getItem: () => '{"episode":"none","scene":"enter"}',
    setItem: () => {},
  };
  assert.equal(loadProgress(), null, "unknown episode is ignored");
  globalThis.localStorage = {
    getItem: () => "{broken",
    setItem: () => {},
  };
  assert.equal(loadProgress(), null, "corrupt json is ignored");
  delete globalThis.localStorage;
  assert.deepEqual(historyFor("enter"), []);
  assert.deepEqual(historyFor("actionB"), ["enter", "choice"]);
  assert.deepEqual(historyFor("afterglow"), ["enter", "choice", "actionA"]);
});
