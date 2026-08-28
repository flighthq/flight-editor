import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

import ts from 'typescript';

// This is a structural policy gate: matching a describe name does not prove that the function is called or
// meaningfully asserted on. Behavioral depth remains the responsibility of the tests inside those suites.

export interface CompletenessViolation {
  detail: string;
  label: 'matching describe blocks' | 'test file exists';
  path: string;
}

export interface CompletenessReport {
  functionalFileCount: number;
  passed: boolean;
  sourceFileCount: number;
  violations: CompletenessViolation[];
}

interface SourceFile {
  absolutePath: string;
  relativePath: string;
  testPath: string;
}

export function getDescribeNames(filePath: string, sourceText: string): string[] {
  const sourceFile = parseSourceFile(filePath, sourceText);
  const names = new Set<string>();

  function visit(node: ts.Node): void {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'describe' &&
      node.arguments.length > 0
    ) {
      const name = node.arguments[0];
      if (ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name)) names.add(name.text);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return [...names].sort();
}

export function getFunctionExports(filePath: string, sourceText: string): string[] {
  const sourceFile = parseSourceFile(filePath, sourceText);
  const localFunctions = new Set<string>();
  const exportedFunctions = new Set<string>();

  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name !== undefined) {
      localFunctions.add(statement.name.text);
    } else if (ts.isVariableStatement(statement)) {
      collectVariableFunctions(statement.declarationList, localFunctions);
    }
  }

  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement) && hasModifier(statement, ts.SyntaxKind.ExportKeyword)) {
      if (hasModifier(statement, ts.SyntaxKind.DefaultKeyword)) {
        exportedFunctions.add('default');
      } else if (statement.name !== undefined) {
        exportedFunctions.add(statement.name.text);
      }
      continue;
    }

    if (ts.isVariableStatement(statement) && hasModifier(statement, ts.SyntaxKind.ExportKeyword)) {
      collectVariableFunctions(statement.declarationList, exportedFunctions);
      continue;
    }

    if (ts.isExportDeclaration(statement) && statement.moduleSpecifier === undefined && !statement.isTypeOnly) {
      const clause = statement.exportClause;
      if (clause === undefined || !ts.isNamedExports(clause)) continue;
      for (const element of clause.elements) {
        if (element.isTypeOnly) continue;
        const localName = (element.propertyName ?? element.name).text;
        if (localFunctions.has(localName)) exportedFunctions.add(element.name.text);
      }
      continue;
    }

    if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
      const expression = statement.expression;
      if (
        ts.isArrowFunction(expression) ||
        ts.isFunctionExpression(expression) ||
        (ts.isIdentifier(expression) && localFunctions.has(expression.text))
      ) {
        exportedFunctions.add('default');
      }
    }
  }

  return [...exportedFunctions].sort();
}

export function checkSourceTestCompleteness(root: string): CompletenessReport {
  const violations: CompletenessViolation[] = [];
  const sourceFiles = findSourceFiles(root);
  let functionalFileCount = 0;

  for (const file of sourceFiles) {
    const sourceText = readFileSync(file.absolutePath, 'utf8');
    const exports = getFunctionExports(file.absolutePath, sourceText);
    if (exports.length > 0) functionalFileCount++;

    if (!existsSync(file.testPath)) {
      violations.push({
        detail: `expected ${relative(root, file.testPath).replaceAll('\\', '/')}`,
        label: 'test file exists',
        path: file.relativePath,
      });
      continue;
    }

    if (exports.length === 0) continue;
    const describeNames = new Set(getDescribeNames(file.testPath, readFileSync(file.testPath, 'utf8')));
    const missing = exports.filter((name) => !describeNames.has(name));
    if (missing.length === 0) continue;
    violations.push({
      detail: `missing describe blocks: ${missing.join(', ')}`,
      label: 'matching describe blocks',
      path: file.relativePath,
    });
  }

  return {
    functionalFileCount,
    passed: violations.length === 0,
    sourceFileCount: sourceFiles.length,
    violations,
  };
}

function collectVariableFunctions(declarationList: ts.VariableDeclarationList, names: Set<string>): void {
  for (const declaration of declarationList.declarations) {
    if (
      ts.isIdentifier(declaration.name) &&
      declaration.initializer !== undefined &&
      (ts.isArrowFunction(declaration.initializer) || ts.isFunctionExpression(declaration.initializer))
    ) {
      names.add(declaration.name.text);
    }
  }
}

function findSourceFiles(root: string): SourceFile[] {
  const packagesDirectory = join(root, 'packages');
  const files: SourceFile[] = [];

  for (const packageEntry of readdirSync(packagesDirectory, { withFileTypes: true })) {
    if (!packageEntry.isDirectory()) continue;
    const sourceDirectory = join(packagesDirectory, packageEntry.name, 'src');
    if (!existsSync(sourceDirectory)) continue;
    collectSourceFiles(root, sourceDirectory, files);
  }

  return files.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

function collectSourceFiles(root: string, directory: string, files: SourceFile[]): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(root, absolutePath, files);
      continue;
    }
    if (
      !entry.isFile() ||
      (!entry.name.endsWith('.ts') && !entry.name.endsWith('.tsx')) ||
      entry.name.endsWith('.test.ts') ||
      entry.name.endsWith('.test.tsx') ||
      entry.name.endsWith('.d.ts')
    ) {
      continue;
    }

    const testPath = absolutePath.replace(/\.(tsx?)$/, '.test.$1');
    files.push({
      absolutePath,
      relativePath: relative(root, absolutePath).replaceAll('\\', '/'),
      testPath,
    });
  }
}

function hasModifier(node: ts.Node, kind: ts.SyntaxKind): boolean {
  return ts.canHaveModifiers(node) && (ts.getModifiers(node)?.some((modifier) => modifier.kind === kind) ?? false);
}

function parseSourceFile(filePath: string, sourceText: string): ts.SourceFile {
  const scriptKind = filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, scriptKind);
}
