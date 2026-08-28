import { describe, expect, it } from 'vitest';

import { createEditorState } from './editorState';
import {
  getEditorKeyBinding,
  getEditorRegisteredActions,
  matchEditorKeyEvent,
  registerEditorKeyBinding,
  unregisterEditorKeyBinding,
} from './keyboardManager';

describe('registerEditorKeyBinding', () => {
  it('registers a key binding', () => {
    const editor = createEditorState();
    registerEditorKeyBinding(editor, 'undo', { key: 'z', ctrl: true });
    expect(getEditorRegisteredActions(editor)).toContain('undo');
  });
});

describe('unregisterEditorKeyBinding', () => {
  it('removes a key binding', () => {
    const editor = createEditorState();
    registerEditorKeyBinding(editor, 'undo', { key: 'z', ctrl: true });
    unregisterEditorKeyBinding(editor, 'undo');
    expect(getEditorRegisteredActions(editor)).not.toContain('undo');
  });
});

describe('getEditorKeyBinding', () => {
  it('returns the binding for an action', () => {
    const editor = createEditorState();
    registerEditorKeyBinding(editor, 'save', { key: 's', ctrl: true });
    const binding = getEditorKeyBinding(editor, 'save');
    expect(binding).not.toBeNull();
    expect(binding!.key).toBe('s');
  });

  it('returns null for unregistered action', () => {
    const editor = createEditorState();
    expect(getEditorKeyBinding(editor, 'missing')).toBeNull();
  });
});

describe('matchEditorKeyEvent', () => {
  it('matches a key event to a registered action', () => {
    const editor = createEditorState();
    registerEditorKeyBinding(editor, 'undo', { key: 'z', ctrl: true });
    const action = matchEditorKeyEvent(editor, {
      key: 'z',
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    });
    expect(action).toBe('undo');
  });

  it('returns null when no match', () => {
    const editor = createEditorState();
    const action = matchEditorKeyEvent(editor, {
      key: 'q',
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    });
    expect(action).toBeNull();
  });
});

describe('getEditorRegisteredActions', () => {
  it('returns empty when no bindings registered', () => {
    const editor = createEditorState();
    expect(getEditorRegisteredActions(editor)).toHaveLength(0);
  });
});
