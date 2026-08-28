import { describe, expect, it } from 'vitest';

import { createKeyEventFromDom, createPointerEventFromDom, bindDomEvents } from './domEventAdapter';

describe('createPointerEventFromDom', () => {
  it('maps client coordinates relative to canvas bounds', () => {
    const canvas = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 50,
        right: 900,
        bottom: 550,
        width: 800,
        height: 500,
        x: 100,
        y: 50,
        toJSON: () => {},
      }),
    } as unknown as HTMLCanvasElement;

    const domEvent = {
      clientX: 200,
      clientY: 150,
      button: 0,
      shiftKey: false,
      ctrlKey: true,
      altKey: false,
      metaKey: false,
    } as unknown as PointerEvent;

    const result = createPointerEventFromDom(domEvent, canvas);
    expect(result.x).toBe(100);
    expect(result.y).toBe(100);
    expect(result.button).toBe(0);
    expect(result.ctrlKey).toBe(true);
    expect(result.shiftKey).toBe(false);
  });

  it('handles canvas at origin', () => {
    const canvas = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        right: 800,
        bottom: 600,
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        toJSON: () => {},
      }),
    } as unknown as HTMLCanvasElement;

    const domEvent = {
      clientX: 400,
      clientY: 300,
      button: 2,
      shiftKey: true,
      ctrlKey: false,
      altKey: true,
      metaKey: false,
    } as unknown as PointerEvent;

    const result = createPointerEventFromDom(domEvent, canvas);
    expect(result.x).toBe(400);
    expect(result.y).toBe(300);
    expect(result.button).toBe(2);
    expect(result.altKey).toBe(true);
  });
});

describe('createKeyEventFromDom', () => {
  it('maps DOM keyboard event properties', () => {
    const domEvent = {
      key: 'z',
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    } as unknown as KeyboardEvent;

    const result = createKeyEventFromDom(domEvent);
    expect(result.key).toBe('z');
    expect(result.ctrlKey).toBe(true);
    expect(result.shiftKey).toBe(false);
  });

  it('preserves modifier key state', () => {
    const domEvent = {
      key: 'Delete',
      ctrlKey: false,
      shiftKey: true,
      altKey: true,
      metaKey: true,
    } as unknown as KeyboardEvent;

    const result = createKeyEventFromDom(domEvent);
    expect(result.key).toBe('Delete');
    expect(result.shiftKey).toBe(true);
    expect(result.altKey).toBe(true);
    expect(result.metaKey).toBe(true);
  });
});

describe('bindDomEvents', () => {
  it('is a function', () => {
    expect(bindDomEvents).toBeTypeOf('function');
  });
});
