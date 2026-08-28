import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import pc from 'picocolors';

const scriptPath = fileURLToPath(import.meta.url);
const root = resolve(dirname(scriptPath), '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const checks = [
  ['package metadata', 'packages:check'],
  ['source/test completeness', 'exports:check'],
  ['license provenance', 'check:license-provenance'],
  ['orphaned package output', 'check:package-dist-orphans'],
  ['VS Code extension', 'check:vscode'],
  ['types', 'typecheck'],
  ['tests', 'test'],
  ['lint', 'lint'],
  ['format', 'format:check'],
] as const;

for (const [label, script] of checks) {
  console.log(pc.cyan(`\n==> Checking ${label}`));
  const result = spawnSync(npm, ['run', script], { cwd: root, stdio: 'inherit' });
  if (result.error !== undefined) throw result.error;
  if (result.status === 0) continue;
  console.error(pc.red(`\nCheck failed: ${label}`));
  process.exit(result.status ?? 1);
}

console.log(pc.green('\nAll checks passed.'));
