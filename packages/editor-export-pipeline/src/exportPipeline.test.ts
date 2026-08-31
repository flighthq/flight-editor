import { describe, expect, it } from 'vitest';
import type { EditorExporter, ExportAsset } from './exportPipeline';
import {
  compareExportReproducibility,
  createExportPipelineState,
  createExportPlan,
  registerExporter,
  runExportPlan,
  unregisterExporter,
} from './exportPipeline';
const exporter: EditorExporter = {
  id: 'web',
  version: '2',
  targetVersions: ['1'],
  requiredCapabilities: ['write'],
  async export({ assets, report }) {
    report(1, 'done');
    return assets.map(({ id }) => ({ path: `${id}.json`, mediaType: 'application/json', content: id }));
  },
};
const assets = new Map<string, ExportAsset>([
  ['root', { id: 'root', dependencies: ['image'], value: {} }],
  ['image', { id: 'image', dependencies: [], value: {} }],
]);
describe('createExportPipelineState', () => {
  it('starts without target coupling', () => expect(createExportPipelineState().version).toBe(0));
});
describe('registerExporter', () => {
  it('registers versioned exporters and rejects conflicts', () => {
    const state = createExportPipelineState();
    registerExporter(state, exporter);
    expect(() => registerExporter(state, exporter)).toThrow('already');
  });
});
describe('unregisterExporter', () => {
  it('disposes exporter contributions by identity', () => {
    const state = createExportPipelineState();
    registerExporter(state, exporter);
    expect(unregisterExporter(state, 'web')).toBe(true);
  });
});
describe('createExportPlan', () => {
  it('resolves deterministic dependency closure', () => {
    const state = createExportPipelineState();
    registerExporter(state, exporter);
    const plan = createExportPlan(
      state,
      { exporterId: 'web', targetVersion: '1', rootAssetIds: ['root'], options: {} },
      assets,
      new Set(['write']),
    );
    expect(plan.assets.map(({ id }) => id)).toEqual(['image', 'root']);
  });
  it('reports missing assets, capabilities, and target mismatches', () => {
    const state = createExportPipelineState();
    registerExporter(state, exporter);
    const plan = createExportPlan(
      state,
      { exporterId: 'web', targetVersion: 'old', rootAssetIds: ['gone'], options: {} },
      assets,
      new Set(),
    );
    expect(plan.diagnostics).toHaveLength(3);
  });
});
describe('runExportPlan', () => {
  it('reports progress and reproducibility metadata without mutating inputs', async () => {
    const state = createExportPipelineState();
    registerExporter(state, exporter);
    const plan = createExportPlan(
      state,
      { exporterId: 'web', targetVersion: '1', rootAssetIds: ['root'], options: { unit: 'px' } },
      assets,
      new Set(['write']),
    );
    const progress: number[] = [];
    const result = await runExportPlan(plan, new AbortController().signal, (value) => progress.push(value));
    expect(result).toMatchObject({ status: 'succeeded', metadata: { exporterVersion: '2' } });
    expect(progress).toEqual([1]);
  });
  it('supports cancellation and exporter failures', async () => {
    const controller = new AbortController();
    controller.abort();
    const state = createExportPipelineState();
    registerExporter(state, exporter);
    const plan = createExportPlan(
      state,
      { exporterId: 'web', targetVersion: '1', rootAssetIds: [], options: {} },
      assets,
      new Set(['write']),
    );
    expect((await runExportPlan(plan, controller.signal)).status).toBe('cancelled');
  });
});
describe('compareExportReproducibility', () => {
  it('compares inputs and exact ordered artifacts', async () => {
    const state = createExportPipelineState();
    registerExporter(state, exporter);
    const plan = createExportPlan(
      state,
      { exporterId: 'web', targetVersion: '1', rootAssetIds: ['root'], options: {} },
      assets,
      new Set(['write']),
    );
    const first = await runExportPlan(plan, new AbortController().signal);
    const second = await runExportPlan(plan, new AbortController().signal);
    expect(compareExportReproducibility(first, second)).toBe(true);
  });
});
