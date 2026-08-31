export type ConformanceCapability =
  | 'clipboard'
  | 'diagnostics'
  | 'external-reload'
  | 'focus'
  | 'gesture-cancel'
  | 'layout-contributions'
  | 'preview';
export type ConformanceLevel = 'mandatory' | 'optional' | 'target';
export interface EditorConformanceAdapter {
  readonly target: string;
  readonly capabilities: ReadonlySet<ConformanceCapability>;
  load(fixture: string): void | Promise<void>;
  edit(value: string): void | Promise<void>;
  undo(): void | Promise<void>;
  save(): string | Promise<string>;
  focus?(): boolean | Promise<boolean>;
  cancelGesture?(): boolean | Promise<boolean>;
  reloadExternal?(value: string): string | Promise<string>;
  getDiagnostics?(): readonly string[] | Promise<readonly string[]>;
  contributeLayout?(): boolean | Promise<boolean>;
  copyPaste?(): string | Promise<string>;
  previewLifecycle?(): readonly string[] | Promise<readonly string[]>;
}
export interface ConformanceScenario {
  readonly id: string;
  readonly level: ConformanceLevel;
  readonly capability?: ConformanceCapability;
  readonly targets?: readonly string[];
  run(adapter: EditorConformanceAdapter): void | Promise<void>;
}
export interface ConformanceResult {
  readonly scenarioId: string;
  readonly status: 'passed' | 'failed' | 'skipped';
  readonly message?: string;
}
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
export function createCoreConformanceScenarios(): readonly ConformanceScenario[] {
  return [
    {
      id: 'load-edit-undo-save',
      level: 'mandatory',
      async run(adapter) {
        await adapter.load('original');
        await adapter.edit('changed');
        await adapter.undo();
        assert((await adapter.save()) === 'original', 'Undo/save did not restore canonical content');
      },
    },
    {
      id: 'focus',
      level: 'optional',
      capability: 'focus',
      async run(adapter) {
        assert(await adapter.focus?.(), 'Editor did not accept focus');
      },
    },
    {
      id: 'gesture-cancel',
      level: 'optional',
      capability: 'gesture-cancel',
      async run(adapter) {
        assert(await adapter.cancelGesture?.(), 'Gesture cancellation failed');
      },
    },
    {
      id: 'external-reload',
      level: 'optional',
      capability: 'external-reload',
      async run(adapter) {
        assert((await adapter.reloadExternal?.('external')) === 'external', 'External reload was not reconciled');
      },
    },
    {
      id: 'diagnostics',
      level: 'optional',
      capability: 'diagnostics',
      async run(adapter) {
        assert(Array.isArray(await adapter.getDiagnostics?.()), 'Diagnostics unavailable');
      },
    },
    {
      id: 'layout-contribution',
      level: 'optional',
      capability: 'layout-contributions',
      async run(adapter) {
        assert(await adapter.contributeLayout?.(), 'Layout contribution failed');
      },
    },
    {
      id: 'clipboard',
      level: 'optional',
      capability: 'clipboard',
      async run(adapter) {
        assert((await adapter.copyPaste?.()) === 'copy', 'Clipboard round-trip failed');
      },
    },
    {
      id: 'preview-lifecycle',
      level: 'optional',
      capability: 'preview',
      async run(adapter) {
        assert(
          JSON.stringify(await adapter.previewLifecycle?.()) === JSON.stringify(['start', 'reload', 'stop']),
          'Preview lifecycle diverged',
        );
      },
    },
  ];
}
export function defineTargetConformanceScenario(
  id: string,
  targets: readonly string[],
  run: ConformanceScenario['run'],
): ConformanceScenario {
  if (id.trim() === '' || targets.length === 0) throw new TypeError('Target scenario requires identity and targets');
  return { id, level: 'target', targets: targets.slice(), run };
}
export function validateConformanceSuite(scenarios: readonly ConformanceScenario[]): readonly string[] {
  const seen = new Set<string>();
  const issues: string[] = [];
  for (const scenario of scenarios) {
    if (scenario.id.trim() === '') issues.push('Scenario id must not be empty');
    if (seen.has(scenario.id)) issues.push(`Duplicate scenario: ${scenario.id}`);
    if (scenario.level === 'optional' && scenario.capability === undefined)
      issues.push(`Optional scenario lacks capability: ${scenario.id}`);
    if (scenario.level === 'target' && (scenario.targets?.length ?? 0) === 0)
      issues.push(`Target scenario lacks targets: ${scenario.id}`);
    seen.add(scenario.id);
  }
  return issues.sort();
}
export async function runConformanceSuite(
  adapter: EditorConformanceAdapter,
  scenarios: readonly ConformanceScenario[] = createCoreConformanceScenarios(),
): Promise<readonly ConformanceResult[]> {
  const invalid = validateConformanceSuite(scenarios);
  if (invalid.length > 0) throw new Error(invalid[0]);
  const results: ConformanceResult[] = [];
  for (const scenario of scenarios) {
    const applies = scenario.level !== 'target' || scenario.targets!.includes(adapter.target);
    const supported = scenario.capability === undefined || adapter.capabilities.has(scenario.capability);
    if (!applies || !supported) {
      results.push({ scenarioId: scenario.id, status: 'skipped' });
      continue;
    }
    try {
      await scenario.run(adapter);
      results.push({ scenarioId: scenario.id, status: 'passed' });
    } catch (error) {
      results.push({
        scenarioId: scenario.id,
        status: 'failed',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return results;
}
export function assertMandatoryConformance(
  scenarios: readonly ConformanceScenario[],
  results: readonly ConformanceResult[],
): void {
  const byId = new Map(results.map((result) => [result.scenarioId, result]));
  for (const scenario of scenarios) {
    if (scenario.level !== 'mandatory') continue;
    const result = byId.get(scenario.id);
    if (result?.status !== 'passed')
      throw new Error(`Mandatory conformance failed: ${scenario.id}${result?.message ? `: ${result.message}` : ''}`);
  }
}
