import { getNodeTransform2D, setNodeTransform2D } from '@flighthq/node';
import { createNode2D, createScene2D } from '@flighthq/scene2d';
import { setSelection } from '@flighthq/editor-selection';
import { undo } from '@flighthq/editor-command';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import type { Node2D } from '@flighthq/types';

import { executeNamedCommand, registerDefaultCommands } from './commandRegistry';
import { createEditorState, setEditorScene } from './editorState';

function setPosition(node: Node2D, x: number, y: number): void {
  setNodeTransform2D(node, {
    pivotX: 0,
    pivotY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    x,
    y,
  });
}

function getPosition(node: Node2D): { x: number; y: number } {
  const transform = {
    pivotX: 0,
    pivotY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    x: 0,
    y: 0,
  };
  getNodeTransform2D(transform, node);
  return { x: transform.x, y: transform.y };
}

describe('registerDefaultCommands', () => {
  it('registers the built-in command factories under stable names', () => {
    const editor = createEditorState();
    registerDefaultCommands(editor);

    expect(Array.from(editor.commandRegistry.keys())).toEqual([
      'copy',
      'cut',
      'alignLeft',
      'alignRight',
      'alignTop',
      'alignBottom',
      'alignHorizontalCenters',
      'alignVerticalCenters',
      'distributeHorizontally',
      'distributeVertically',
      'deleteSelection',
      'duplicateSelection',
      'lockSelection',
      'flipHorizontal',
      'flipVertical',
      'bringForward',
      'sendBackward',
      'bringToFront',
      'sendToBack',
      'resetTransform',
      'removeNode',
      'ungroup',
      'setNodeName',
      'setNodeSize',
      'setPivot',
      'setAlpha',
      'setVisible',
      'setBlendMode',
      'setClip',
      'setColorAdjustments',
      'setTransform2D',
      'clearScene',
      'setSceneAlign',
      'setScaleMode',
      'setSceneColor',
      'setSceneBackgroundColor',
      'setSceneSize',
      'setSceneName',
      'addNode',
      'addFromFactory',
      'paste',
      'reparentNode',
      'moveToPage',
      'reorderNodes',
      'groupNodes',
      'createFromShape',
    ]);
  });

  it('refreshes registrations without duplicating names', () => {
    const editor = createEditorState();
    registerDefaultCommands(editor);
    registerDefaultCommands(editor);

    expect(editor.commandRegistry.size).toBe(46);
  });
});

describe('executeNamedCommand', () => {
  it('executes selection commands through history and marks the scene dirty', () => {
    const editor = createEditorState();
    const left = createNode2D(DisplayObjectKind);
    const right = createNode2D(DisplayObjectKind);
    setPosition(left, 10, 20);
    setPosition(right, 50, 40);
    setSelection(editor.selection, [left, right]);
    registerDefaultCommands(editor);

    expect(executeNamedCommand(editor, 'alignLeft')).toBe(true);
    expect([getPosition(left).x, getPosition(right).x]).toEqual([10, 10]);
    expect(editor.commandHistory.undoStack).toHaveLength(1);
    expect(editor.sceneState.dirty).toBe(true);

    undo(editor.commandHistory);
    expect([getPosition(left).x, getPosition(right).x]).toEqual([10, 50]);
  });

  it('accepts explicit node and scene arguments', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind, { name: 'Before' });
    const scene = createScene2D({ scene2dWidth: 800, scene2dHeight: 600 });
    setEditorScene(editor, scene);
    registerDefaultCommands(editor);

    expect(executeNamedCommand(editor, 'setNodeName', { node, name: 'After' })).toBe(true);
    expect(executeNamedCommand(editor, 'setSceneSize', { width: 1920, height: 1080 })).toBe(true);
    expect(node.name).toBe('After');
    expect([scene.scene2dWidth, scene.scene2dHeight]).toEqual([1920, 1080]);
  });

  it('uses the primary selection for single-node commands', () => {
    const editor = createEditorState();
    const node = createNode2D(DisplayObjectKind);
    setPosition(node, 12, 34);
    setSelection(editor.selection, [node]);
    registerDefaultCommands(editor);

    expect(executeNamedCommand(editor, 'resetTransform')).toBe(true);
    expect(getPosition(node)).toEqual({ x: 0, y: 0 });
  });

  it('returns false for unknown commands and invalid arguments', () => {
    const editor = createEditorState();
    registerDefaultCommands(editor);

    expect(executeNamedCommand(editor, 'missing')).toBe(false);
    expect(executeNamedCommand(editor, 'setNodeSize', { width: 10 })).toBe(false);
    expect(editor.commandHistory.undoStack).toHaveLength(0);
  });

  it('dispatches host-registered command factories', () => {
    const editor = createEditorState();
    let value = 0;
    editor.commandRegistry.set('custom', (_state, arguments_) => {
      if (typeof arguments_.value !== 'number') return null;
      const previous = value;
      return {
        label: 'Custom',
        execute: () => {
          value = arguments_.value as number;
        },
        undo: () => {
          value = previous;
        },
      };
    });

    expect(executeNamedCommand(editor, 'custom', { value: 7 })).toBe(true);
    expect(value).toBe(7);
    undo(editor.commandHistory);
    expect(value).toBe(0);
  });

  it('returns false when scene commands have no scene set', () => {
    const editor = createEditorState();
    registerDefaultCommands(editor);

    expect(executeNamedCommand(editor, 'clearScene')).toBe(false);
    expect(executeNamedCommand(editor, 'setSceneSize', { width: 100, height: 100 })).toBe(false);
    expect(executeNamedCommand(editor, 'setSceneColor', { color: 0xff0000 })).toBe(false);
  });

  it('returns false when node commands have no selection and no explicit node', () => {
    const editor = createEditorState();
    registerDefaultCommands(editor);

    expect(executeNamedCommand(editor, 'setAlpha', { alpha: 0.5 })).toBe(false);
    expect(executeNamedCommand(editor, 'flipHorizontal')).toBe(false);
  });
});
