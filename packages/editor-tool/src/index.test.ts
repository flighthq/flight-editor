import * as tool from './index';

describe('@flighthq/editor-tool exports', () => {
  it('exposes the public runtime API', () => {
    expect(Object.keys(tool).sort()).toEqual([
      'activateTool',
      'createToolRegistry',
      'deactivateTool',
      'getActiveTool',
      'getActiveToolId',
      'getRegisteredToolIds',
      'isToolActive',
      'registerTool',
      'unregisterTool',
    ]);
  });
});
