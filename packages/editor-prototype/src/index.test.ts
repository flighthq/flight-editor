import * as prototype from './index';

describe('@flighthq/editor-prototype exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(prototype).sort()).toEqual([
      'addFlow',
      'addInteraction',
      'createPrototypeState',
      'getActiveFlowId',
      'getFlow',
      'getFlowCount',
      'getFlows',
      'getInteraction',
      'getInteractionCount',
      'getInteractionsForNode',
      'getPrototypeVersion',
      'isPreviewActive',
      'removeFlow',
      'removeInteraction',
      'setActiveFlowId',
      'setPreviewActive',
    ]);
  });
});
