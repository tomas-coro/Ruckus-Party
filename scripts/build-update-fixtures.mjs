import { cp, mkdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import process from 'node:process';

const artifacts = resolve('tests/.artifacts');
await rm(artifacts, { recursive: true, force: true });
await mkdir(artifacts, { recursive: true });

for (const version of ['v1', 'v2']) {
  const result = spawnSync('npm', ['run', 'build', '--', '--mode', 'test'], {
    cwd: process.cwd(),
    env: { ...process.env, VITE_APP_VERSION: version },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Build ${version} failed`);
  }
  await cp(resolve('dist'), resolve(artifacts, version), { recursive: true });
}
