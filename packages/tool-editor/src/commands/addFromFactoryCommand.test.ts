import { registerNodeKind } from '@flighthq/editor-node-factory';
import { addNodeChild, getNodeChildAt, getNodeChildCount, getNodeParent } from '@flighthq/node';
import { createNode2D } from '@flighthq/scene2d';
import { createEditorState } from '@flighthq/tool-editor';
import { DisplayObjectKind } from '@flighthq/types';
import { describe, expect, it } from 'vitest';

import { createAddFromFactoryCommand } from './addFromFactoryCommand';

describe('createAddFromFactoryCommand', () => {
  it('creates and adds a registered node, then removes it on undo', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const created = createNode2D(DisplayObjectKind);
    registerNodeKind(editor.nodeFactory, 'display-object', 'Display Object', 'Test', () => created);
    const command = createAddFromFactoryCommand(editor, 'display-object', parent);

    expect(command).not.toBeNull();
    expect(command?.label).toBe('Add Display Object');

    command?.execute();

    expect(getNodeChildCount(parent)).toBe(1);
    expect(getNodeChildAt(parent, 0)).toBe(created);
    expect(getNodeParent(created)).toBe(parent);

    command?.undo();

    expect(getNodeChildCount(parent)).toBe(0);
    expect(getNodeParent(created)).toBeNull();
  });

  it('returns null for an unregistered kind', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);

    expect(createAddFromFactoryCommand(editor, 'missing', parent)).toBeNull();
  });

  it('can re-execute after undo', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const created = createNode2D(DisplayObjectKind);
    registerNodeKind(editor.nodeFactory, 'test', 'Test', 'Test', () => created);
    const command = createAddFromFactoryCommand(editor, 'test', parent)!;

    command.execute();
    command.undo();
    command.execute();

    expect(getNodeChildCount(parent)).toBe(1);
    expect(getNodeChildAt(parent, 0)).toBe(created);
  });

  it('appends after existing children', () => {
    const editor = createEditorState();
    const parent = createNode2D(DisplayObjectKind);
    const existing = createNode2D(DisplayObjectKind);
    addNodeChild(parent, existing);

    const created = createNode2D(DisplayObjectKind);
    registerNodeKind(editor.nodeFactory, 'test', 'Test', 'Test', () => created);
    const command = createAddFromFactoryCommand(editor, 'test', parent)!;

    command.execute();

    expect(getNodeChildCount(parent)).toBe(2);
    expect(getNodeChildAt(parent, 0)).toBe(existing);
    expect(getNodeChildAt(parent, 1)).toBe(created);
  });
});
