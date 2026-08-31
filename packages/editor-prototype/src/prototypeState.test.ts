import { describe, expect, it } from 'vitest';

import {
  addFlow,
  addInteraction,
  compilePrototype,
  createPrototypeState,
  getActiveFlowId,
  getFlow,
  getFlowCount,
  getFlows,
  getInteraction,
  getInteractionCount,
  getInteractionsForNode,
  getPrototypeVersion,
  getPrototypeSessionVersion,
  isPreviewActive,
  removeFlow,
  removeInteraction,
  reconnectInteraction,
  setActiveFlowId,
  setPreviewActive,
  validatePrototypeState,
} from './prototypeState';

import type { PrototypeFlow, PrototypeInteraction } from './prototypeState';

const interA: PrototypeInteraction = {
  id: 'ia-1',
  sourceNodeId: 'node-1',
  trigger: 'click',
  action: 'navigate',
  targetNodeId: 'node-2',
  transition: 'dissolve',
  durationMs: 300,
};

const interB: PrototypeInteraction = {
  id: 'ia-2',
  sourceNodeId: 'node-1',
  trigger: 'hover',
  action: 'overlay',
  targetNodeId: 'node-3',
  transition: 'instant',
  durationMs: 0,
};

const interC: PrototypeInteraction = {
  id: 'ia-3',
  sourceNodeId: 'node-5',
  trigger: 'click',
  action: 'back',
  targetNodeId: null,
  transition: 'slide-right',
  durationMs: 200,
};

const flowA: PrototypeFlow = { id: 'flow-1', name: 'Onboarding', startNodeId: 'node-1' };
const flowB: PrototypeFlow = { id: 'flow-2', name: 'Checkout', startNodeId: 'node-10' };

describe('createPrototypeState', () => {
  it('starts empty', () => {
    const state = createPrototypeState();
    expect(getInteractionCount(state)).toBe(0);
    expect(getFlowCount(state)).toBe(0);
    expect(getActiveFlowId(state)).toBeNull();
    expect(isPreviewActive(state)).toBe(false);
    expect(getPrototypeVersion(state)).toBe(0);
  });
});

describe('addInteraction', () => {
  it('adds an interaction', () => {
    const state = createPrototypeState();
    addInteraction(state, interA);
    expect(getInteractionCount(state)).toBe(1);
    expect(getInteraction(state, 'ia-1')).toEqual(interA);
    expect(getPrototypeVersion(state)).toBe(1);
  });
});

describe('removeInteraction', () => {
  it('removes an interaction', () => {
    const state = createPrototypeState();
    addInteraction(state, interA);
    const removed = removeInteraction(state, 'ia-1');
    expect(removed).toBe(true);
    expect(getInteractionCount(state)).toBe(0);
  });

  it('returns false when not found', () => {
    const state = createPrototypeState();
    const removed = removeInteraction(state, 'nonexistent');
    expect(removed).toBe(false);
    expect(getPrototypeVersion(state)).toBe(0);
  });
});

describe('getInteraction', () => {
  it('returns undefined for unknown id', () => {
    const state = createPrototypeState();
    expect(getInteraction(state, 'nonexistent')).toBeUndefined();
  });
});

describe('getInteractionsForNode', () => {
  it('filters by source node id', () => {
    const state = createPrototypeState();
    addInteraction(state, interA);
    addInteraction(state, interB);
    addInteraction(state, interC);
    expect(getInteractionsForNode(state, 'node-1')).toEqual([interA, interB]);
    expect(getInteractionsForNode(state, 'node-5')).toEqual([interC]);
  });

  it('returns empty for unknown node', () => {
    const state = createPrototypeState();
    expect(getInteractionsForNode(state, 'nonexistent')).toEqual([]);
  });
});

describe('getInteractionCount', () => {
  it('is exported', () => expect(getInteractionCount).toBeTypeOf('function'));
});

describe('addFlow', () => {
  it('adds a flow', () => {
    const state = createPrototypeState();
    addFlow(state, flowA);
    expect(getFlowCount(state)).toBe(1);
    expect(getFlow(state, 'flow-1')).toEqual(flowA);
  });
});

describe('removeFlow', () => {
  it('removes a flow', () => {
    const state = createPrototypeState();
    addFlow(state, flowA);
    const removed = removeFlow(state, 'flow-1');
    expect(removed).toBe(true);
    expect(getFlowCount(state)).toBe(0);
  });

  it('clears active flow if it was active', () => {
    const state = createPrototypeState();
    addFlow(state, flowA);
    setActiveFlowId(state, 'flow-1');
    removeFlow(state, 'flow-1');
    expect(getActiveFlowId(state)).toBeNull();
  });

  it('returns false when not found', () => {
    const state = createPrototypeState();
    const removed = removeFlow(state, 'nonexistent');
    expect(removed).toBe(false);
    expect(getPrototypeVersion(state)).toBe(0);
  });
});

describe('getFlow', () => {
  it('returns undefined for unknown id', () => {
    const state = createPrototypeState();
    expect(getFlow(state, 'nonexistent')).toBeUndefined();
  });
});

describe('getFlows', () => {
  it('returns all flows', () => {
    const state = createPrototypeState();
    addFlow(state, flowA);
    addFlow(state, flowB);
    expect(getFlows(state)).toEqual([flowB, flowA]);
  });
});

describe('getFlowCount', () => {
  it('is exported', () => expect(getFlowCount).toBeTypeOf('function'));
});

describe('getActiveFlowId', () => {
  it('is exported', () => expect(getActiveFlowId).toBeTypeOf('function'));
});

describe('setActiveFlowId', () => {
  it('sets the active flow', () => {
    const state = createPrototypeState();
    addFlow(state, flowA);
    setActiveFlowId(state, 'flow-1');
    expect(getActiveFlowId(state)).toBe('flow-1');
  });

  it('does not bump version when unchanged', () => {
    const state = createPrototypeState();
    setActiveFlowId(state, null);
    expect(getPrototypeVersion(state)).toBe(0);
  });
});

describe('isPreviewActive', () => {
  it('is exported', () => expect(isPreviewActive).toBeTypeOf('function'));
});

describe('setPreviewActive', () => {
  it('toggles preview mode', () => {
    const state = createPrototypeState();
    setPreviewActive(state, true);
    expect(isPreviewActive(state)).toBe(true);
    expect(getPrototypeVersion(state)).toBe(0);
    expect(getPrototypeSessionVersion(state)).toBe(1);
  });

  it('does not bump version when unchanged', () => {
    const state = createPrototypeState();
    setPreviewActive(state, false);
    expect(getPrototypeVersion(state)).toBe(0);
  });
});

describe('getPrototypeVersion', () => {
  it('is exported', () => expect(getPrototypeVersion).toBeTypeOf('function'));
});

describe('getPrototypeSessionVersion', () => {
  it('keeps active flow and preview changes out of the authored revision', () => {
    const state = createPrototypeState();
    addFlow(state, flowA);
    const authored = getPrototypeVersion(state);
    setActiveFlowId(state, flowA.id);
    setPreviewActive(state, true);
    expect(getPrototypeVersion(state)).toBe(authored);
    expect(getPrototypeSessionVersion(state)).toBe(2);
  });
});

describe('reconnectInteraction', () => {
  it('updates a wire target without changing its stable identity', () => {
    const state = createPrototypeState();
    addInteraction(state, interA);
    expect(reconnectInteraction(state, interA.id, 'node-9')).toBe(true);
    expect(getInteraction(state, interA.id)?.targetNodeId).toBe('node-9');
    expect(reconnectInteraction(state, interA.id, 'node-9')).toBe(false);
  });
});

describe('validatePrototypeState', () => {
  it('reports broken graph references and trigger ambiguity deterministically', () => {
    const state = createPrototypeState();
    addFlow(state, flowA);
    addInteraction(state, interA);
    addInteraction(state, interB);
    const duplicate = { ...interA, id: 'ia-0', targetNodeId: 'missing' };
    addInteraction(state, duplicate);
    expect(validatePrototypeState(state, new Set(['node-1', 'node-3'])).map(({ code }) => code)).toEqual([
      'broken-target',
      'broken-target',
      'duplicate-trigger',
    ]);
  });
});

describe('compilePrototype', () => {
  it('produces a deterministic, revision-stamped snapshot', () => {
    const state = createPrototypeState();
    addInteraction(state, interB);
    addInteraction(state, interA);
    addFlow(state, flowB);
    addFlow(state, flowA);
    const compiled = compilePrototype(state);
    expect(compiled.revision).toBe(getPrototypeVersion(state));
    expect(compiled.interactions.map(({ id }) => id)).toEqual(['ia-1', 'ia-2']);
    expect(compiled.flows.map(({ id }) => id)).toEqual(['flow-1', 'flow-2']);
  });
});
