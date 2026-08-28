import type { EditorPointerEvent } from '@flighthq/editor-tool';

import type { EditorState } from './editorState';
import type { KeyEventLike } from './commandDispatch';

import { handleKeyDown, handlePointerDown, handlePointerMove, handlePointerUp } from './eventHandler';

export interface DomEventBindings {
  readonly canvas: HTMLCanvasElement;
  readonly dispose: () => void;
}

export function createPointerEventFromDom(event: PointerEvent, canvas: HTMLCanvasElement): EditorPointerEvent {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    button: event.button,
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    altKey: event.altKey,
    metaKey: event.metaKey,
  };
}

export function createKeyEventFromDom(event: KeyboardEvent): KeyEventLike {
  return {
    key: event.key,
    ctrlKey: event.ctrlKey,
    shiftKey: event.shiftKey,
    altKey: event.altKey,
    metaKey: event.metaKey,
  };
}

export function bindDomEvents(editor: EditorState, canvas: HTMLCanvasElement): DomEventBindings {
  const onPointerDown = (event: PointerEvent) => {
    canvas.setPointerCapture(event.pointerId);
    handlePointerDown(editor, createPointerEventFromDom(event, canvas));
  };

  const onPointerMove = (event: PointerEvent) => {
    handlePointerMove(editor, createPointerEventFromDom(event, canvas));
  };

  const onPointerUp = (event: PointerEvent) => {
    canvas.releasePointerCapture(event.pointerId);
    handlePointerUp(editor, createPointerEventFromDom(event, canvas));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const handled = handleKeyDown(editor, createKeyEventFromDom(event));
    if (handled) {
      event.preventDefault();
    }
  };

  const onContextMenu = (event: Event) => {
    event.preventDefault();
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('contextmenu', onContextMenu);
  window.addEventListener('keydown', onKeyDown);

  return {
    canvas,
    dispose() {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onKeyDown);
    },
  };
}
