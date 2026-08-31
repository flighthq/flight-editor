export {
  beginTextEditing,
  clearTextSelection,
  createTextEditingState,
  endTextEditing,
  getCaretPosition,
  getTextEditingTargetId,
  getTextEditingVersion,
  getTextSelection,
  hasTextSelection,
  isComposing,
  isTextEditingActive,
  setCaretPosition,
  setComposing,
  setTextSelection,
} from './textEditingState';

export type { TextEditingState, TextSelection } from './textEditingState';
