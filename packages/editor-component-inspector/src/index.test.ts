import { describe, expect, it } from 'vitest';

import * as inspector from './index';

describe('@flighthq/editor-component-inspector exports', () => {
  it('exposes its host-neutral surface', () => {
    expect(Object.keys(inspector).sort()).toEqual([
      'copyPasteInspectedComponent',
      'createComponentInspectorState',
      'createInspectorMutationCommand',
      'inspectComponents',
      'migrateInspectedComponents',
      'mutateInspectedComponents',
      'registerInspectorSchema',
      'unregisterInspectorOwner',
    ]);
  });
});
