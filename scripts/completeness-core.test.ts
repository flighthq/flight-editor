import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { checkSourceTestCompleteness, getDescribeNames, getFunctionExports } from './completeness-core';

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { force: true, recursive: true });
});

describe('checkSourceTestCompleteness', () => {
  it('accepts source files with colocated tests and exact describe names', () => {
    const root = createRepository({
      'feature.ts': 'export function alpha() {}\nexport const beta = () => true;\n',
      'feature.test.ts': "describe('alpha', () => {});\ndescribe('beta', () => {});\n",
      'index.ts': "export { alpha, beta } from './feature';\n",
      'index.test.ts': "describe('package exports', () => {});\n",
    });

    expect(checkSourceTestCompleteness(root)).toEqual({
      functionalFileCount: 1,
      passed: true,
      sourceFileCount: 2,
      violations: [],
    });
  });

  it('reports every source file without a colocated test, including an index', () => {
    const root = createRepository({
      'feature.ts': 'export const alpha = () => true;\n',
      'index.ts': "export { alpha } from './feature';\n",
    });

    expect(checkSourceTestCompleteness(root).violations).toEqual([
      {
        detail: 'expected packages/example/src/feature.test.ts',
        label: 'test file exists',
        path: 'packages/example/src/feature.ts',
      },
      {
        detail: 'expected packages/example/src/index.test.ts',
        label: 'test file exists',
        path: 'packages/example/src/index.ts',
      },
    ]);
  });

  it('reports exported functions without exact matching describe blocks', () => {
    const root = createRepository({
      'feature.ts': 'export function alpha() {}\nexport const beta = () => true;\n',
      'feature.test.ts': "describe('feature', () => {});\ndescribe('alpha behavior', () => {});\n",
    });

    expect(checkSourceTestCompleteness(root).violations).toEqual([
      {
        detail: 'missing describe blocks: alpha, beta',
        label: 'matching describe blocks',
        path: 'packages/example/src/feature.ts',
      },
    ]);
  });
});

describe('getDescribeNames', () => {
  it('collects nested describe calls with static string names', () => {
    expect(
      getDescribeNames(
        'feature.test.ts',
        "describe('alpha', () => { describe(`beta`, () => {}); });\ndescribe(name, () => {});",
      ),
    ).toEqual(['alpha', 'beta']);
  });
});

describe('getFunctionExports', () => {
  it('collects exported function declarations and function-valued variables', () => {
    expect(
      getFunctionExports(
        'feature.ts',
        `
          export function declared() {}
          export async function asyncDeclared() {}
          export const arrow = () => true;
          export const expression = function () {};
          export const value = 1;
        `,
      ),
    ).toEqual(['arrow', 'asyncDeclared', 'declared', 'expression']);
  });

  it('collects local aliases and callable defaults but ignores forwarded exports', () => {
    expect(
      getFunctionExports(
        'feature.ts',
        `
          import { imported } from './imported';
          const local = () => true;
          export { local as alias, imported };
          export { forwarded } from './forwarded';
          export default local;
        `,
      ),
    ).toEqual(['alias', 'default']);
  });

  it('collects directly declared callable default exports', () => {
    expect(getFunctionExports('feature.ts', 'export default () => true;')).toEqual(['default']);
    expect(getFunctionExports('feature.ts', 'export default function () {}')).toEqual(['default']);
    expect(getFunctionExports('feature.ts', 'export default 1;')).toEqual([]);
  });

  it('deduplicates overload declarations and ignores type-only exports', () => {
    expect(
      getFunctionExports(
        'feature.ts',
        `
          export function overloaded(value: string): string;
          export function overloaded(value: number): number;
          export function overloaded(value: string | number): string | number { return value; }
          type Callback = () => void;
          export type { Callback };
        `,
      ),
    ).toEqual(['overloaded']);
  });
});

function createRepository(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'flight-editor-completeness-'));
  temporaryDirectories.push(root);
  const sourceDirectory = join(root, 'packages', 'example', 'src');
  mkdirSync(sourceDirectory, { recursive: true });
  for (const [path, contents] of Object.entries(files)) writeFileSync(join(sourceDirectory, path), contents);
  return root;
}
