import * as selectionActions from './index';

describe('@flighthq/editor-selection-actions exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(selectionActions).sort()).toEqual([
      'invertSelection',
      'selectAll',
      'selectChildren',
      'selectNone',
      'selectParent',
      'selectSiblings',
    ]);
  });
});
