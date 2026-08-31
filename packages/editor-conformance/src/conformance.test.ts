import { describe, expect, it } from 'vitest';
import type { ConformanceCapability, EditorConformanceAdapter } from './conformance';
import {
  assertMandatoryConformance,
  createCoreConformanceScenarios,
  defineTargetConformanceScenario,
  runConformanceSuite,
  validateConformanceSuite,
} from './conformance';
function adapter(capabilities: ReadonlySet<ConformanceCapability> = new Set()): EditorConformanceAdapter {
  let value = '';
  return {
    target: 'test',
    capabilities,
    load(input) {
      value = input;
    },
    edit(input) {
      value = input;
    },
    undo() {
      value = 'original';
    },
    save() {
      return value;
    },
    focus: () => true,
  };
}
describe('createCoreConformanceScenarios', () => {
  it('covers the shared behavioral contract', () =>
    expect(createCoreConformanceScenarios().map(({ id }) => id)).toEqual([
      'load-edit-undo-save',
      'focus',
      'gesture-cancel',
      'external-reload',
      'diagnostics',
      'layout-contribution',
      'clipboard',
      'preview-lifecycle',
    ]));
});
describe('defineTargetConformanceScenario', () => {
  it('limits target assertions explicitly', () =>
    expect(defineTargetConformanceScenario('vscode-panel', ['vscode'], () => {}).targets).toEqual(['vscode']));
});
describe('validateConformanceSuite', () => {
  it('detects duplicates and malformed capability gates', () =>
    expect(
      validateConformanceSuite([
        { id: 'x', level: 'optional', run() {} },
        { id: 'x', level: 'mandatory', run() {} },
      ]),
    ).toEqual(['Duplicate scenario: x', 'Optional scenario lacks capability: x']));
});
describe('runConformanceSuite', () => {
  it('runs mandatory behavior and skips unsupported optional behavior', async () => {
    const results = await runConformanceSuite(adapter());
    expect(results[0]?.status).toBe('passed');
    expect(results.slice(1).every(({ status }) => status === 'skipped')).toBe(true);
  });
  it('runs supported capabilities and target-specific assertions', async () => {
    const scenarios = [
      createCoreConformanceScenarios()[1]!,
      defineTargetConformanceScenario('test-only', ['test'], () => {}),
    ];
    const results = await runConformanceSuite(adapter(new Set(['focus'])), scenarios);
    expect(results.map(({ status }) => status)).toEqual(['passed', 'passed']);
  });
});
describe('assertMandatoryConformance', () => {
  it('fails missing or failed mandatory scenarios while ignoring optional failures', () => {
    const scenarios = createCoreConformanceScenarios();
    expect(() => assertMandatoryConformance(scenarios, [])).toThrow('load-edit-undo-save');
    expect(() =>
      assertMandatoryConformance(scenarios, [{ scenarioId: 'load-edit-undo-save', status: 'passed' }]),
    ).not.toThrow();
  });
});
