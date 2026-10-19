import assert from 'node:assert/strict';
import test from 'node:test';
import { appChanged, release } from './app-test-release.mjs';

test('문서·웹 전용 변경은 생략하고 알 수 없는 변경은 앱 변경으로 처리', () => {
  assert.equal(appChanged(['docs/specs/feed.md', 'src/app/feed.web.tsx'], 'android'), false);
  assert.equal(appChanged(['src/app/feed.tsx'], 'android'), true);
  assert.equal(appChanged(['src/app/removed.tsx'], 'ios'), true);
  assert.equal(appChanged(['new-native-config.json'], 'ios'), true);
});

test('성공 기준이 있고 앱 변경이 없으면 EAS를 호출하지 않음', async () => {
  const result = await release({ platform: 'ios', sha: 'new', state: { success: { sha: 'old' } },
    files: ['README.md'], eas: () => assert.fail('Unexpected EAS call'), save: () => assert.fail('Unexpected save') });
  assert.equal(result, 'skip');
});

test('호환되는 앱 변경은 테스트 채널에만 OTA 배포 후 성공 기준 갱신', async () => {
  const saved = [], calls = [];
  const result = await release({ platform: 'android', sha: 'new',
    state: { success: { sha: 'old', fingerprint: 'native', buildId: 'existing' } }, files: ['src/app/index.tsx'],
    eas: async (args) => { calls.push(args); return { hash: 'native' }; }, save: async (s) => saved.push(s) });
  assert.equal(result, 'ota');
  assert.equal(calls[1][0], 'update');
  assert.equal(calls[1][calls[1].indexOf('--channel') + 1], 'testing');
  assert.equal(saved[0].success.sha, 'new');
  assert.equal(saved[0].success.buildId, 'existing');
});

test('첫 빌드는 제출 성공 전 성공 기준을 만들지 않고 제출 실패 후 동일 ID로 재개', async () => {
  let state = {}, builds = 0;
  const eas = async (args) => {
    if (args[0] === 'fingerprint:generate') return { hash: 'native' };
    if (args[0] === 'build') { builds++; return [{ id: 'exact-build', status: 'FINISHED' }]; }
    if (args[0] === 'submit') throw new Error('Store unavailable');
    assert.fail('Unexpected command');
  };
  const input = { platform: 'ios', sha: 'new', files: [], eas, save: async (s) => { state = s; } };
  await assert.rejects(release({ ...input, state }), /Store unavailable/);
  assert.equal(state.success, undefined);
  assert.equal(state.pending.buildId, 'exact-build');
  const result = await release({ ...input, state, eas: async (args) => {
    if (args[0] === 'submit') {
      assert.equal(args[args.indexOf('--id') + 1], 'exact-build');
      return;
    }
    return eas(args);
  } });
  assert.equal(builds, 1);
  assert.equal(result, 'build-submit');
  assert.equal(state.success.sha, 'new');
  assert.equal(state.pending, null);
});

test('OTA 실패나 빌드 실패 시 성공 기준을 앞당기지 않음', async () => {
  for (const native of [true, false]) {
    await assert.rejects(release({ platform: 'android', sha: 'new', files: ['src/app/index.tsx'],
      state: { success: { sha: 'old', fingerprint: 'old' } },
      eas: async (args) => {
        if (args[0] === 'fingerprint:generate') return { hash: native ? 'new' : 'old' };
        if (args[0] === 'build') return [{ id: 'failed', status: 'ERRORED' }];
        throw new Error('OTA failed');
      }, save: () => assert.fail('Failed release advanced baseline') }));
  }
});
