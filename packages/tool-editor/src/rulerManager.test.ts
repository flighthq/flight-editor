import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  areEditorRulersVisible,
  getEditorRulerOrigin,
  getEditorRulerSubdivisions,
  getEditorRulerTickSpacing,
  getEditorRulerUnit,
  getEditorSubdivisionSpacing,
  hideEditorRulers,
  resetEditorRulerOrigin,
  setEditorRulerOrigin,
  setEditorRulerSubdivisions,
  setEditorRulerTickSpacing,
  setEditorRulerUnit,
  showEditorRulers,
  toggleEditorRulers,
} from './rulerManager';

describe('showEditorRulers', () => {
  it('makes rulers visible', () => {
    const editor = createEditorState();
    hideEditorRulers(editor);
    showEditorRulers(editor);
    expect(areEditorRulersVisible(editor)).toBe(true);
  });
});

describe('hideEditorRulers', () => {
  it('hides rulers', () => {
    const editor = createEditorState();
    showEditorRulers(editor);
    hideEditorRulers(editor);
    expect(areEditorRulersVisible(editor)).toBe(false);
  });
});

describe('toggleEditorRulers', () => {
  it('toggles ruler visibility', () => {
    const editor = createEditorState();
    const initial = areEditorRulersVisible(editor);
    toggleEditorRulers(editor);
    expect(areEditorRulersVisible(editor)).toBe(!initial);
  });
});

describe('setEditorRulerUnit', () => {
  it('changes the ruler unit', () => {
    const editor = createEditorState();
    setEditorRulerUnit(editor, 'inches');
    expect(getEditorRulerUnit(editor)).toBe('inches');
  });
});

describe('setEditorRulerOrigin', () => {
  it('sets custom origin', () => {
    const editor = createEditorState();
    setEditorRulerOrigin(editor, 50, 100);
    const origin = getEditorRulerOrigin(editor);
    expect(origin.x).toBe(50);
    expect(origin.y).toBe(100);
  });
});

describe('resetEditorRulerOrigin', () => {
  it('resets origin to zero', () => {
    const editor = createEditorState();
    setEditorRulerOrigin(editor, 50, 100);
    resetEditorRulerOrigin(editor);
    const origin = getEditorRulerOrigin(editor);
    expect(origin.x).toBe(0);
    expect(origin.y).toBe(0);
  });
});

describe('setEditorRulerTickSpacing', () => {
  it('sets tick spacing', () => {
    const editor = createEditorState();
    setEditorRulerTickSpacing(editor, 50);
    expect(getEditorRulerTickSpacing(editor)).toBe(50);
  });
});

describe('setEditorRulerSubdivisions', () => {
  it('sets subdivisions', () => {
    const editor = createEditorState();
    setEditorRulerSubdivisions(editor, 4);
    expect(getEditorRulerSubdivisions(editor)).toBe(4);
  });
});

describe('areEditorRulersVisible', () => {
  it('returns initial visibility', () => {
    const editor = createEditorState();
    expect(typeof areEditorRulersVisible(editor)).toBe('boolean');
  });
});

describe('getEditorRulerUnit', () => {
  it('returns the ruler unit', () => {
    const editor = createEditorState();
    expect(typeof getEditorRulerUnit(editor)).toBe('string');
  });
});

describe('getEditorRulerOrigin', () => {
  it('returns origin coordinates', () => {
    const editor = createEditorState();
    const origin = getEditorRulerOrigin(editor);
    expect(typeof origin.x).toBe('number');
    expect(typeof origin.y).toBe('number');
  });
});

describe('getEditorRulerTickSpacing', () => {
  it('returns tick spacing', () => {
    const editor = createEditorState();
    expect(typeof getEditorRulerTickSpacing(editor)).toBe('number');
  });
});

describe('getEditorRulerSubdivisions', () => {
  it('returns subdivisions count', () => {
    const editor = createEditorState();
    expect(typeof getEditorRulerSubdivisions(editor)).toBe('number');
  });
});

describe('getEditorSubdivisionSpacing', () => {
  it('returns computed subdivision spacing', () => {
    const editor = createEditorState();
    setEditorRulerTickSpacing(editor, 100);
    setEditorRulerSubdivisions(editor, 4);
    expect(getEditorSubdivisionSpacing(editor)).toBe(25);
  });
});
