import * as host from './index';

describe('@flighthq/editor-host exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(host).sort()).toEqual([
      'createDesktopCapabilities',
      'createHeadlessAdapter',
      'createHeadlessCapabilities',
      'createHostAdapterState',
      'getHostAdapter',
      'getHostAdapterVersion',
      'getHostCallbacks',
      'getHostCapabilities',
      'hasCapability',
      'setHostAdapter',
      'setHostCallbacks',
    ]);
  });
});
