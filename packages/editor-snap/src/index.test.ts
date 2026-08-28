import * as snap from './index';

describe('@flighthq/editor-snap exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(snap).sort()).toEqual([
      'addSnapGuide',
      'clearSnapGuides',
      'createSnapConfig',
      'enableSnapGrid',
      'removeSnapGuide',
      'setSnapGrid',
      'snapPosition',
    ]);
  });
});
