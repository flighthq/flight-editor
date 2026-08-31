import * as animation from './index';

describe('@flighthq/editor-animation exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(animation).sort()).toEqual([
      'addKeyframe',
      'createAnimationState',
      'deleteTime',
      'findKeyframeAt',
      'getAnimationSessionVersion',
      'getAnimationVersion',
      'getDuration',
      'getKeyframe',
      'getKeyframeCount',
      'getKeyframesForNode',
      'getKeyframesForTrack',
      'getPlayheadTime',
      'insertTime',
      'isLooping',
      'isPlaying',
      'removeKeyframe',
      'setDuration',
      'setLooping',
      'setPlayheadTime',
      'setPlaying',
      'updateKeyframe',
      'validateAnimationState',
    ]);
  });
});
