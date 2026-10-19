import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function appChanged(files, platform) {
  return files.some((file) => {
    if (/^(docs|\.github|\.agents|\.claude)\//.test(file)) return false;
    if (/^[^/]+\.md$/.test(file)) return false;
    if (/\.(web|d)\.[cm]?[jt]sx?$/.test(file)) return false;
    if (platform === 'android' && /\.ios\.[cm]?[jt]sx?$/.test(file)) return false;
    if (platform === 'ios' && /\.android\.[cm]?[jt]sx?$/.test(file)) return false;
    return !['.gitignore', 'eslint.config.js', 'tsconfig.json'].includes(file);
  });
}

// 성공 기준과 제출 대기 빌드를 구분해 실패 후 다른 바이너리가 제출되지 않게 합니다.
export async function release({ platform, sha, state, files, eas, save }) {
  if (state.success && !appChanged(files, platform)) return 'skip';
  const fingerprint = await eas(['fingerprint:generate', '--platform', platform, '--build-profile', 'testing']);
  if (!fingerprint.hash) throw new Error('EAS fingerprint hash is missing');
  if (state.success?.fingerprint === fingerprint.hash) {
    const update = await eas(['update', '--channel', 'testing', '--environment', 'preview', '--platform', platform,
      '--message', `App test ${sha}`]);
    await save({ success: { ...state.success, sha, update }, pending: null });
    return 'ota';
  }
  let pending = state.pending;
  if (pending?.sha !== sha || pending?.fingerprint !== fingerprint.hash) {
    const builds = await eas(['build', '--platform', platform, '--profile', 'testing', '--wait']);
    const build = builds?.[0];
    if (builds.length !== 1 || build?.status !== 'FINISHED' || !build.id) {
      throw new Error('Expected one successful EAS build');
    }
    pending = { sha, fingerprint: fingerprint.hash, buildId: build.id };
    await save({ ...state, pending });
  }
  await eas(['submit', '--platform', platform, '--profile', 'testing', '--id', pending.buildId, '--wait'], false);
  await save({ success: pending, pending: null });
  return 'build-submit';
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

async function main() {
  const platform = process.argv[2];
  if (!['android', 'ios'].includes(platform)) throw new Error('Expected android or ios');
  if (!process.env.EXPO_TOKEN) throw new Error('EXPO_TOKEN is required');
  if (git('status', '--porcelain')) throw new Error('Release source must be clean');
  const config = JSON.parse(readFileSync('eas.json', 'utf8'));
  if (config.build?.testing?.channel !== 'testing' || config.submit?.testing?.android?.track !== 'internal') {
    throw new Error('Automatic releases require the testing channel and internal Play track');
  }
  const sha = git('rev-parse', 'HEAD');
  const ref = `refs/tags/app-test-${platform}`;
  let lease = '';
  let state = {};
  // 원격 조회 실패를 배포 이력이 없는 상태로 오인하지 않습니다.
  const remote = git('ls-remote', '--refs', 'origin', ref);
  if (remote) {
    lease = remote.split(/\s/)[0];
    git('fetch', 'origin', `+${ref}:${ref}`);
    state = JSON.parse(git('for-each-ref', '--format=%(contents)', ref));
    if (state.success) git('merge-base', '--is-ancestor', state.success.sha, sha);
  }
  const files = state.success
    ? git('diff', '--name-only', '--no-renames', '-z', state.success.sha, sha).split('\0').filter(Boolean)
    : [];
  const eas = async (args, json = true) => {
    if (args[0] === 'build' && platform === 'ios') {
      const appId = config.submit?.testing?.ios?.ascAppId || config.submit?.production?.ios?.ascAppId;
      if (!/^\d+$/.test(appId || '')) throw new Error('Register the iOS app and set submit.production.ios.ascAppId before building.');
    }
    const output = execFileSync('npx', ['--yes', 'eas-cli@latest', ...args, '--non-interactive', ...(json ? ['--json'] : [])], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 64 * 1024 * 1024,
    });
    if (!json) { process.stdout.write(output); return; }
    return JSON.parse(output);
  };
  const save = async (next) => {
    git('-c', 'user.name=github-actions[bot]', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com',
      'tag', '-f', '-a', ref.slice('refs/tags/'.length), sha, '-m', JSON.stringify(next));
    git('push', `--force-with-lease=${ref}:${lease}`, 'origin', `${ref}:${ref}`);
    lease = git('rev-parse', ref);
  };
  const result = await release({ platform, sha, state, files, eas, save });
  const summary = `${platform}: ${result} (${sha})\n`;
  process.stdout.write(summary);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error); process.exitCode = 1; });
}
