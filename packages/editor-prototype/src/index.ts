export {
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
export { createPrototypeCommand } from './prototypeCommand';

export type {
  CompiledPrototype,
  PrototypeAction,
  PrototypeDiagnostic,
  PrototypeFlow,
  PrototypeInteraction,
  PrototypeState,
  PrototypeTransition,
  PrototypeTrigger,
} from './prototypeState';
