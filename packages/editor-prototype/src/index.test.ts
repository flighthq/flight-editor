import * as prototype from './index';

describe('@flighthq/editor-prototype exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(prototype).sort()).toEqual([
      'addFlow',
      'addInteraction',
      'compilePrototype',
      'createPrototypeState',
      'getActiveFlowId',
      'getFlow',
      'getFlowCount',
      'getFlows',
      'getInteraction',
      'getInteractionCount',
      'getInteractionsForNode',
      'getPrototypeSessionVersion',
      'getPrototypeVersion',
      'isPreviewActive',
      'reconnectInteraction',
      'removeFlow',
      'removeInteraction',
      'setActiveFlowId',
      'setPreviewActive',
      'validatePrototypeState',
    ]);
  });
});
