import { addNodeChild } from '@flighthq/node';
import { addToSelection } from '@flighthq/editor-selection';
import { createNode2D } from '@flighthq/scene2d';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import {
  alignBottom,
  alignCenterH,
  alignCenterV,
  alignLeft,
  alignRight,
  alignSelection,
  alignTop,
  distributeHorizontal,
  distributeSelection,
  distributeVertical,
} from './alignmentOps';
import { createEditorState } from './editorState';
import { createNewScene } from './sceneManager';

function setupEditor(nodeCount: number) {
  const editor = createEditorState();
  createNewScene(editor);
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    const node = createNode2D(DisplayObjectKind);
    addNodeChild(editor.scene!.root, node);
    addToSelection(editor.selection, node);
    nodes.push(node);
  }
  return { editor, nodes };
}

describe('alignSelection', () => {
  it('returns false with fewer than 2 nodes', () => {
    const { editor } = setupEditor(1);
    expect(alignSelection(editor, 'left')).toBe(false);
  });

  it('aligns with 2 or more nodes', () => {
    const { editor } = setupEditor(2);
    expect(alignSelection(editor, 'left')).toBe(true);
  });
});

describe('alignLeft', () => {
  it('aligns nodes left', () => {
    const { editor } = setupEditor(2);
    expect(alignLeft(editor)).toBe(true);
  });
});

describe('alignRight', () => {
  it('aligns nodes right', () => {
    const { editor } = setupEditor(2);
    expect(alignRight(editor)).toBe(true);
  });
});

describe('alignTop', () => {
  it('aligns nodes top', () => {
    const { editor } = setupEditor(2);
    expect(alignTop(editor)).toBe(true);
  });
});

describe('alignBottom', () => {
  it('aligns nodes bottom', () => {
    const { editor } = setupEditor(2);
    expect(alignBottom(editor)).toBe(true);
  });
});

describe('alignCenterH', () => {
  it('aligns nodes center-h', () => {
    const { editor } = setupEditor(2);
    expect(alignCenterH(editor)).toBe(true);
  });
});

describe('alignCenterV', () => {
  it('aligns nodes center-v', () => {
    const { editor } = setupEditor(2);
    expect(alignCenterV(editor)).toBe(true);
  });
});

describe('distributeSelection', () => {
  it('returns false with fewer than 3 nodes', () => {
    const { editor } = setupEditor(2);
    expect(distributeSelection(editor, 'horizontal')).toBe(false);
  });

  it('distributes with 3 or more nodes', () => {
    const { editor } = setupEditor(3);
    expect(distributeSelection(editor, 'horizontal')).toBe(true);
  });
});

describe('distributeHorizontal', () => {
  it('distributes nodes horizontally', () => {
    const { editor } = setupEditor(3);
    expect(distributeHorizontal(editor)).toBe(true);
  });
});

describe('distributeVertical', () => {
  it('distributes nodes vertically', () => {
    const { editor } = setupEditor(3);
    expect(distributeVertical(editor)).toBe(true);
  });
});
