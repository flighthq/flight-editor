import * as nodeFactory from './index';

describe('@flighthq/editor-node-factory exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(nodeFactory).sort()).toEqual([
      'createNodeFactory',
      'createNodeFromKind',
      'getNodeKindCategories',
      'getNodeKindEntry',
      'getNodeKindIds',
      'getNodeKindsByCategory',
      'registerNodeKind',
      'unregisterNodeKind',
    ]);
  });
});
