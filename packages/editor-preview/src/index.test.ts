import * as preview from './index';

describe('@flighthq/editor-preview exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(preview).sort()).toEqual([
      'completePreviewOperation',
      'createPreviewState',
      'discardRuntimeOverrides',
      'failPreviewOperation',
      'getRuntimeOverrides',
      'recordRuntimeOverride',
      'requestPreviewPause',
      'requestPreviewReload',
      'requestPreviewRestart',
      'requestPreviewResume',
      'requestPreviewStart',
      'requestPreviewStep',
      'requestPreviewStop',
      'takeRuntimeOverridesForApply',
    ]);
  });
});
