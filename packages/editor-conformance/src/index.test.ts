import { describe, expect, it } from 'vitest';
import * as api from './index';
describe('@flighthq/editor-conformance exports', () => {
  it('exposes scenario tooling', () =>
    expect(Object.keys(api).sort()).toEqual([
      'assertMandatoryConformance',
      'createCoreConformanceScenarios',
      'defineTargetConformanceScenario',
      'runConformanceSuite',
      'validateConformanceSuite',
    ]));
});
