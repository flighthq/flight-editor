import * as api from './index';
import { describe, expect, it } from 'vitest';

describe('createVectorAuthoringState', () => {
  it('is exported', () => expect(api.createVectorAuthoringState).toBeTypeOf('function'));
});
describe('addVectorShape', () => {
  it('is exported', () => expect(api.addVectorShape).toBeTypeOf('function'));
});
describe('appendVectorVertex', () => {
  it('is exported', () => expect(api.appendVectorVertex).toBeTypeOf('function'));
});
describe('moveVectorVertices', () => {
  it('is exported', () => expect(api.moveVectorVertices).toBeTypeOf('function'));
});
describe('setVectorPaint', () => {
  it('is exported', () => expect(api.setVectorPaint).toBeTypeOf('function'));
});
describe('closeVectorSubpath', () => {
  it('is exported', () => expect(api.closeVectorSubpath).toBeTypeOf('function'));
});
describe('selectVectorVertices', () => {
  it('is exported', () => expect(api.selectVectorVertices).toBeTypeOf('function'));
});
describe('validateVectorShape', () => {
  it('is exported', () => expect(api.validateVectorShape).toBeTypeOf('function'));
});

describe('vector-authoring behavior', () => {
  it('moves topology without mutating caller data', () => {
    const state = api.createVectorAuthoringState();
    const shape = {
      id: 's',
      subpaths: [{ id: 'p', closed: false, vertices: [{ id: 'a', x: 0, y: 0 }] }],
      fill: null,
      stroke: null,
      strokeWidth: 0,
    } as const;
    api.addVectorShape(state, shape);
    api.moveVectorVertices(state, 's', new Set(['a']), 4, 5);
    expect(state.shapes.get('s')?.subpaths[0]?.vertices[0]).toMatchObject({ x: 4, y: 5 });
    expect(shape.subpaths[0].vertices[0]).toMatchObject({ x: 0, y: 0 });
  });
});
