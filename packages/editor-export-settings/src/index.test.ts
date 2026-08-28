import { describe, expect, it } from 'vitest';

import * as exportSettings from './index';

describe('editor-export-settings package surface', () => {
  it('exports export-slice state operations', () => {
    expect(exportSettings.createExportSettingsState).toBeTypeOf('function');
    expect(exportSettings.addExportSlice).toBeTypeOf('function');
    expect(exportSettings.getEnabledExportSlices).toBeTypeOf('function');
  });
});
