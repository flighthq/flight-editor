import { describe, expect, it } from 'vitest';

import {
  createCanvasRenderer,
  disposeCanvasRenderer,
  renderScene,
  resizeCanvasRenderer,
  startCanvasLoop,
  stopCanvasLoop,
} from './canvasRenderer';

describe('createCanvasRenderer', () => {
  it('is a function', () => {
    expect(createCanvasRenderer).toBeTypeOf('function');
  });
});

describe('renderScene', () => {
  it('is a function', () => {
    expect(renderScene).toBeTypeOf('function');
  });
});

describe('startCanvasLoop', () => {
  it('is a function', () => {
    expect(startCanvasLoop).toBeTypeOf('function');
  });
});

describe('stopCanvasLoop', () => {
  it('is a function', () => {
    expect(stopCanvasLoop).toBeTypeOf('function');
  });
});

describe('resizeCanvasRenderer', () => {
  it('is a function', () => {
    expect(resizeCanvasRenderer).toBeTypeOf('function');
  });
});

describe('disposeCanvasRenderer', () => {
  it('is a function', () => {
    expect(disposeCanvasRenderer).toBeTypeOf('function');
  });
});
