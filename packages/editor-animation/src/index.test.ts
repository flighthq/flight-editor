import * as animation from './index';

describe('@flighthq/editor-animation exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(animation).sort()).toEqual([
      'addKeyframe',
      'createAnimationState',
      'getAnimationVersion',
      'getDuration',
      'getKeyframe',
      'getKeyframeCount',
      'getKeyframesForNode',
      'getPlayheadTime',
      'isLooping',
      'isPlaying',
      'removeKeyframe',
      'setDuration',
      'setLooping',
      'setPlayheadTime',
      'setPlaying',
    ]);
  });
});
