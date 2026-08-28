import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import pc from 'picocolors';

import { checkSourceTestCompleteness } from './completeness-core';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const report = checkSourceTestCompleteness(repositoryRoot);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.passed ? 0 : 1);
}

if (!report.passed) {
  for (const violation of report.violations) {
    console.error(`${pc.red('x')} ${pc.white(violation.path)} ${pc.dim(`(${violation.label})`)}`);
    console.error(`  ${pc.yellow(violation.detail)}`);
  }
  console.error(
    pc.red(
      `\n${report.violations.length} source/test completeness violation${report.violations.length === 1 ? '' : 's'}`,
    ),
  );
  process.exit(1);
}

console.log(
  pc.green(
    `Every package source file has a colocated test and all exported functions have matching describe blocks (${report.sourceFileCount} source files, ${report.functionalFileCount} functional files).`,
  ),
);
