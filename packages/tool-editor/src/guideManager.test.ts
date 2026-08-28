import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  addEditorGuide,
  clearAllGuides,
  getEditorGuide,
  getEditorGuideCount,
  getEditorSnapPositions,
  getHorizontalGuides,
  getVerticalGuides,
  lockEditorGuide,
  moveEditorGuide,
  removeEditorGuide,
  unlockEditorGuide,
} from './guideManager';

describe('addEditorGuide', () => {
  it('adds a horizontal guide', () => {
    const editor = createEditorState();
    const guide = addEditorGuide(editor, 'horizontal', 100);
    expect(guide.axis).toBe('horizontal');
    expect(guide.position).toBe(100);
    expect(getEditorGuideCount(editor)).toBe(1);
  });

  it('adds a vertical guide', () => {
    const editor = createEditorState();
    addEditorGuide(editor, 'vertical', 200);
    expect(getVerticalGuides(editor)).toHaveLength(1);
  });

  it('assigns unique ids', () => {
    const editor = createEditorState();
    const g1 = addEditorGuide(editor, 'horizontal', 100);
    const g2 = addEditorGuide(editor, 'horizontal', 200);
    expect(g1.id).not.toBe(g2.id);
  });
});

describe('removeEditorGuide', () => {
  it('removes an existing guide', () => {
    const editor = createEditorState();
    const guide = addEditorGuide(editor, 'horizontal', 100);
    expect(removeEditorGuide(editor, guide.id)).toBe(true);
    expect(getEditorGuideCount(editor)).toBe(0);
  });

  it('returns false for unknown guide', () => {
    const editor = createEditorState();
    expect(removeEditorGuide(editor, 999)).toBe(false);
  });
});

describe('moveEditorGuide', () => {
  it('moves a guide to new position', () => {
    const editor = createEditorState();
    const guide = addEditorGuide(editor, 'horizontal', 100);
    moveEditorGuide(editor, guide.id, 300);
    const found = getEditorGuide(editor, guide.id);
    expect(found).toBeDefined();
    expect(found!.position).toBe(300);
  });
});

describe('lockEditorGuide', () => {
  it('locks a guide', () => {
    const editor = createEditorState();
    const guide = addEditorGuide(editor, 'horizontal', 100);
    lockEditorGuide(editor, guide.id);
    const found = getEditorGuide(editor, guide.id);
    expect(found!.locked).toBe(true);
  });
});

describe('unlockEditorGuide', () => {
  it('unlocks a guide', () => {
    const editor = createEditorState();
    const guide = addEditorGuide(editor, 'horizontal', 100);
    lockEditorGuide(editor, guide.id);
    unlockEditorGuide(editor, guide.id);
    const found = getEditorGuide(editor, guide.id);
    expect(found!.locked).toBe(false);
  });
});

describe('clearAllGuides', () => {
  it('removes all guides', () => {
    const editor = createEditorState();
    addEditorGuide(editor, 'horizontal', 100);
    addEditorGuide(editor, 'vertical', 200);
    addEditorGuide(editor, 'horizontal', 300);
    clearAllGuides(editor);
    expect(getEditorGuideCount(editor)).toBe(0);
  });
});

describe('getEditorGuide', () => {
  it('returns undefined for unknown guide', () => {
    const editor = createEditorState();
    expect(getEditorGuide(editor, 999)).toBeUndefined();
  });
});

describe('getHorizontalGuides', () => {
  it('returns only horizontal guides', () => {
    const editor = createEditorState();
    addEditorGuide(editor, 'horizontal', 100);
    addEditorGuide(editor, 'vertical', 200);
    addEditorGuide(editor, 'horizontal', 300);
    expect(getHorizontalGuides(editor)).toHaveLength(2);
  });
});

describe('getVerticalGuides', () => {
  it('returns only vertical guides', () => {
    const editor = createEditorState();
    addEditorGuide(editor, 'vertical', 100);
    addEditorGuide(editor, 'horizontal', 200);
    expect(getVerticalGuides(editor)).toHaveLength(1);
  });
});

describe('getEditorGuideCount', () => {
  it('returns 0 initially', () => {
    const editor = createEditorState();
    expect(getEditorGuideCount(editor)).toBe(0);
  });
});

describe('getEditorSnapPositions', () => {
  it('returns snap positions for axis', () => {
    const editor = createEditorState();
    addEditorGuide(editor, 'horizontal', 100);
    addEditorGuide(editor, 'horizontal', 200);
    const positions = getEditorSnapPositions(editor, 'horizontal');
    expect(positions).toHaveLength(2);
    expect(positions).toContain(100);
    expect(positions).toContain(200);
  });

  it('returns empty for unused axis', () => {
    const editor = createEditorState();
    addEditorGuide(editor, 'horizontal', 100);
    expect(getEditorSnapPositions(editor, 'vertical')).toHaveLength(0);
  });
});
