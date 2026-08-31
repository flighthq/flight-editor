import { describe, expect, it } from 'vitest';
import * as api from './index';
describe('@flighthq/editor-export-pipeline exports', () => {
  it('exposes orchestration contracts', () =>
    expect(Object.keys(api).sort()).toEqual([
      'compareExportReproducibility',
      'createExportPipelineState',
      'createExportPlan',
      'registerExporter',
      'runExportPlan',
      'unregisterExporter',
    ]));
});
