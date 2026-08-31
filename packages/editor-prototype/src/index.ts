export {
  addFlow,
  addInteraction,
  createPrototypeState,
  getActiveFlowId,
  getFlow,
  getFlowCount,
  getFlows,
  getInteraction,
  getInteractionCount,
  getInteractionsForNode,
  getPrototypeVersion,
  isPreviewActive,
  removeFlow,
  removeInteraction,
  setActiveFlowId,
  setPreviewActive,
} from './prototypeState';

export type {
  PrototypeAction,
  PrototypeFlow,
  PrototypeInteraction,
  PrototypeState,
  PrototypeTransition,
  PrototypeTrigger,
} from './prototypeState';
