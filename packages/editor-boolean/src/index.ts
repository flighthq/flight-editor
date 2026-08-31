export {
  addBooleanEntry,
  clearBooleanEntries,
  createBooleanState,
  getActiveOperation,
  getBooleanEntries,
  getBooleanEntry,
  getBooleanEntryCount,
  getBooleanSessionVersion,
  getBooleanVersion,
  removeBooleanEntry,
  replaceBooleanEntry,
  setActiveOperation,
  validateBooleanState,
} from './booleanState';
export { createBooleanCommand } from './booleanCommand';

export type { BooleanEntry, BooleanOperand, BooleanOperation, BooleanState } from './booleanState';
