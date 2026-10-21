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
