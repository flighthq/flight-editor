import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import pc from 'picocolors';

import { getPackageLicenseViolations, type PackageLicenseManifest } from './package-license-policy';
import { getPackageLockWorkspaceViolations, type PackageLockJson, type WorkspaceManifest } from './package-lock-policy';

const scriptPath = fileURLToPath(import.meta.url);
const repositoryRoot = resolve(dirname(scriptPath), '..');
const packageScope = '@flighthq/';
const repositoryUrl = 'https://github.com/flighthq/flight-editor.git';

const expectedFiles = [
  'dist',
  'src/**/*.test.ts',
  '!dist/**/*.test.js',
  '!dist/**/*.test.d.ts',
  '!dist/**/*.test.js.map',
  '!dist/**/*.test.d.ts.map',
];

const dependencyFields = ['dependencies', 'peerDependencies', 'optionalDependencies', 'devDependencies'] as const;

type JsonRecord = Record<string, unknown>;

interface PackageManifest extends PackageLicenseManifest {
  name?: unknown;
  version?: unknown;
  private?: unknown;
  repository?: unknown;
  type?: unknown;
  main?: unknown;
  types?: unknown;
  exports?: unknown;
  files?: unknown;
  scripts?: unknown;
  description?: unknown;
  sideEffects?: unknown;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface PackageCheckViolation {
  path: string;
  label: string;
  detail: string;
}

export interface PackageCheckReport {
  passed: boolean;
  packageCount: number;
  violations: PackageCheckViolation[];
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8')) as unknown;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, canonicalize(entry)]),
  );
}

function describe(value: unknown): string {
  return JSON.stringify(value) ?? 'undefined';
}

function valuesEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(canonicalize(left)) === JSON.stringify(canonicalize(right));
}

function addExpectedValue(
  violations: PackageCheckViolation[],
  path: string,
  label: string,
  expected: unknown,
  actual: unknown,
): void {
  if (valuesEqual(actual, expected)) return;
  violations.push({
    path,
    label,
    detail: `expected ${describe(expected)}; got ${describe(actual)}`,
  });
}

function getReferences(config: unknown): string[] {
  if (!isRecord(config) || !Array.isArray(config.references)) return [];
  return config.references.flatMap((reference) => {
    if (!isRecord(reference) || typeof reference.path !== 'string') return [];
    return [reference.path.replaceAll('\\', '/').replace(/\/$/, '')];
  });
}

function getPaths(config: unknown): JsonRecord {
  if (!isRecord(config) || !isRecord(config.compilerOptions) || !isRecord(config.compilerOptions.paths)) {
    return {};
  }
  return config.compilerOptions.paths;
}

function getDependencyRecords(manifest: PackageManifest): Array<[string, Record<string, string>]> {
  return dependencyFields.flatMap((field) => {
    const value = manifest[field];
    return value === undefined ? [] : [[field, value] as [string, Record<string, string>]];
  });
}

function toWorkspaceManifest(directory: string, manifest: PackageManifest): WorkspaceManifest {
  return {
    path: `packages/${directory}`,
    name: typeof manifest.name === 'string' ? manifest.name : `${packageScope}${directory}`,
    version: typeof manifest.version === 'string' ? manifest.version : undefined,
    dependencies: manifest.dependencies,
    peerDependencies: manifest.peerDependencies,
    optionalDependencies: manifest.optionalDependencies,
    devDependencies: manifest.devDependencies,
  };
}

function validatePackage(
  root: string,
  directory: string,
  manifest: PackageManifest,
  config: unknown,
  workspaceNames: ReadonlySet<string>,
  rootPaths: JsonRecord,
  buildReferences: ReadonlySet<string>,
): PackageCheckViolation[] {
  const manifestPath = `packages/${directory}/package.json`;
  const packageDirectory = join(root, 'packages', directory);
  const violations: PackageCheckViolation[] = [];
  const expectedName = `${packageScope}${directory}`;

  for (const violation of getPackageLicenseViolations(manifestPath, manifest)) {
    violations.push({ path: manifestPath, ...violation });
  }

  addExpectedValue(violations, manifestPath, 'package name matches its directory', expectedName, manifest.name);
  addExpectedValue(violations, manifestPath, 'package is private', true, manifest.private);
  addExpectedValue(violations, manifestPath, 'package uses ES modules', 'module', manifest.type);
  addExpectedValue(violations, manifestPath, 'package entry point', 'dist/index.js', manifest.main);
  addExpectedValue(violations, manifestPath, 'package type entry point', 'dist/index.d.ts', manifest.types);
  addExpectedValue(
    violations,
    manifestPath,
    'package root export',
    { '.': { types: './dist/index.d.ts', default: './dist/index.js' } },
    manifest.exports,
  );
  addExpectedValue(violations, manifestPath, 'package file allowlist', expectedFiles, manifest.files);
  addExpectedValue(
    violations,
    manifestPath,
    'package repository metadata',
    { type: 'git', url: repositoryUrl, directory: `packages/${directory}` },
    manifest.repository,
  );
  addExpectedValue(violations, manifestPath, 'package has no import side effects', false, manifest.sideEffects);

  const scripts = isRecord(manifest.scripts) ? manifest.scripts : {};
  addExpectedValue(violations, manifestPath, 'build script', 'tsc -b', scripts.build);
  addExpectedValue(violations, manifestPath, 'clean script', 'tsc -b --clean', scripts.clean);
  addExpectedValue(violations, manifestPath, 'test script', 'vitest run --config ../../vitest.config.ts', scripts.test);

  if (typeof manifest.version !== 'string' || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(manifest.version)) {
    violations.push({
      path: manifestPath,
      label: 'package version is semver',
      detail: `got ${describe(manifest.version)}`,
    });
  }
  if (typeof manifest.description !== 'string' || manifest.description.trim() === '') {
    violations.push({
      path: manifestPath,
      label: 'package has a description',
      detail: `got ${describe(manifest.description)}`,
    });
  }
  for (const requiredPath of ['src/index.ts', 'tsconfig.json']) {
    if (existsSync(join(packageDirectory, requiredPath))) continue;
    violations.push({
      path: `packages/${directory}/${requiredPath}`,
      label: `package has ${requiredPath}`,
      detail: 'file is missing',
    });
  }

  addExpectedValue(
    violations,
    'tsconfig.base.json',
    `${expectedName} path alias`,
    [`./packages/${directory}/src/index.ts`],
    rootPaths[expectedName],
  );
  addExpectedValue(
    violations,
    'tsconfig.base.json',
    `${expectedName} wildcard path alias`,
    [`./packages/${directory}/src/*`],
    rootPaths[`${expectedName}/*`],
  );

  const buildReference = `./packages/${directory}`;
  if (!buildReferences.has(buildReference)) {
    violations.push({
      path: 'tsconfig.build.json',
      label: `${expectedName} has a build reference`,
      detail: `add { "path": ${JSON.stringify(buildReference)} }`,
    });
  }

  const declarationFields = new Map<string, string[]>();
  for (const [field, dependencies] of getDependencyRecords(manifest)) {
    for (const [name, range] of Object.entries(dependencies)) {
      declarationFields.set(name, [...(declarationFields.get(name) ?? []), field]);
      if (!name.startsWith(packageScope) || range === '*') continue;
      violations.push({
        path: manifestPath,
        label: `${field} range for ${name} uses workspace resolution`,
        detail: `expected "*"; got ${JSON.stringify(range)}`,
      });
    }
  }
  for (const [name, fields] of declarationFields) {
    if (fields.length < 2) continue;
    violations.push({
      path: manifestPath,
      label: `${name} is declared once`,
      detail: `declared in ${fields.join(', ')}`,
    });
  }

  const expectedReferences = new Set(
    [...declarationFields.keys()]
      .filter((name) => workspaceNames.has(name))
      .map((name) => `../${name.slice(packageScope.length)}`),
  );
  const actualReferences = new Set(getReferences(config));
  for (const reference of expectedReferences) {
    if (actualReferences.has(reference)) continue;
    violations.push({
      path: `packages/${directory}/tsconfig.json`,
      label: `${reference} dependency has a TypeScript project reference`,
      detail: `add { "path": ${JSON.stringify(reference)} } to references`,
    });
  }
  for (const reference of actualReferences) {
    if (expectedReferences.has(reference)) continue;
    violations.push({
      path: `packages/${directory}/tsconfig.json`,
      label: `${reference} TypeScript project reference has a workspace dependency`,
      detail: `declare the dependency or remove the reference`,
    });
  }

  return violations;
}

export function checkRepositoryPackages(root: string): PackageCheckReport {
  const violations: PackageCheckViolation[] = [];
  const packagesDirectory = join(root, 'packages');
  const directories = readdirSync(packagesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const rootManifest = readJson(join(root, 'package.json'));
  if (!isRecord(rootManifest)) throw new Error('package.json must contain a JSON object');
  for (const violation of getPackageLicenseViolations('package.json', rootManifest)) {
    violations.push({ path: 'package.json', ...violation });
  }
  addExpectedValue(violations, 'package.json', 'repository is private', true, rootManifest.private);
  addExpectedValue(violations, 'package.json', 'workspace layout', ['packages/**'], rootManifest.workspaces);

  const manifests = new Map<string, PackageManifest>();
  for (const directory of directories) {
    const path = join(packagesDirectory, directory, 'package.json');
    if (!existsSync(path)) {
      violations.push({
        path: relative(root, path),
        label: 'package directory has a manifest',
        detail: 'file is missing',
      });
      continue;
    }
    const value = readJson(path);
    if (!isRecord(value)) throw new Error(`${relative(root, path)} must contain a JSON object`);
    manifests.set(directory, value as PackageManifest);
  }

  const names = [...manifests.values()].flatMap((manifest) =>
    typeof manifest.name === 'string' ? [manifest.name] : [],
  );
  const workspaceNames = new Set(names);
  for (const name of new Set(names.filter((entry, index) => names.indexOf(entry) !== index))) {
    violations.push({
      path: 'packages',
      label: `${name} is unique`,
      detail: 'the package name is declared by more than one workspace',
    });
  }

  const rootPaths = getPaths(readJson(join(root, 'tsconfig.base.json')));
  const buildReferences = new Set(getReferences(readJson(join(root, 'tsconfig.build.json'))));
  for (const [directory, manifest] of manifests) {
    const configPath = join(packagesDirectory, directory, 'tsconfig.json');
    const config = existsSync(configPath) ? readJson(configPath) : {};
    violations.push(...validatePackage(root, directory, manifest, config, workspaceNames, rootPaths, buildReferences));
  }

  for (const reference of buildReferences) {
    const match = /^\.\/packages\/([^/]+)$/.exec(reference);
    if (match === null || manifests.has(match[1])) continue;
    violations.push({
      path: 'tsconfig.build.json',
      label: `${reference} build reference has a package`,
      detail: 'remove the stale reference or restore the package manifest',
    });
  }
  for (const [alias, targets] of Object.entries(rootPaths)) {
    if (!alias.startsWith(packageScope)) continue;
    const target = Array.isArray(targets) && typeof targets[0] === 'string' ? targets[0] : '';
    const match = /^\.\/packages\/([^/]+)\/src\//.exec(target);
    if (match === null || manifests.has(match[1])) continue;
    violations.push({
      path: 'tsconfig.base.json',
      label: `${alias} path alias has a package`,
      detail: `remove the stale alias or restore packages/${match[1]}/package.json`,
    });
  }

  const workspaceManifests = [...manifests].map(([directory, manifest]) => toWorkspaceManifest(directory, manifest));
  const lock = readJson(join(root, 'package-lock.json')) as PackageLockJson;
  for (const violation of getPackageLockWorkspaceViolations(
    workspaceManifests,
    lock,
    (path) => existsSync(join(root, path)),
    workspaceNames,
  )) {
    violations.push({ path: 'package-lock.json', ...violation });
  }

  violations.sort((left, right) => left.path.localeCompare(right.path) || left.label.localeCompare(right.label));
  return { passed: violations.length === 0, packageCount: manifests.size, violations };
}

function main(): void {
  const report = checkRepositoryPackages(repositoryRoot);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(report, null, 2));
  } else if (report.passed) {
    console.log(pc.green(`Package checks passed (${report.packageCount} packages).`));
  } else {
    console.error(pc.red(`Package checks failed (${report.violations.length} violations):`));
    for (const violation of report.violations) {
      console.error(`\n${pc.bold(violation.path)}: ${violation.label}\n  ${violation.detail}`);
    }
  }
  if (!report.passed) process.exitCode = 1;
}

if (resolve(process.argv[1] ?? '') === resolve(scriptPath)) main();
