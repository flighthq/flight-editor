import * as tauriAdapter from './index';

describe('@flighthq/editor-tauri-adapter exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(tauriAdapter).sort()).toEqual(['createTauriAdapter', 'createTauriCapabilities']);
  });
});
