export interface Command {
  readonly label: string;
  execute(): void;
  undo(): void;
}

export interface CommandHistory {
  undoStack: Command[];
  redoStack: Command[];
  cleanIndex: number;
}

export function createCommandHistory(): CommandHistory {
  return { undoStack: [], redoStack: [], cleanIndex: 0 };
}

export function executeCommand(history: CommandHistory, command: Command): void {
  command.execute();
  history.undoStack.push(command);
  history.redoStack.length = 0;
}

export function undo(history: CommandHistory): boolean {
  const command = history.undoStack.pop();
  if (command === undefined) return false;
  command.undo();
  history.redoStack.push(command);
  return true;
}

export function redo(history: CommandHistory): boolean {
  const command = history.redoStack.pop();
  if (command === undefined) return false;
  command.execute();
  history.undoStack.push(command);
  return true;
}

export function clearCommandHistory(history: CommandHistory): void {
  history.undoStack.length = 0;
  history.redoStack.length = 0;
  history.cleanIndex = 0;
}

export function getCommandHistoryUndoCount(history: Readonly<CommandHistory>): number {
  return history.undoStack.length;
}

export function getCommandHistoryRedoCount(history: Readonly<CommandHistory>): number {
  return history.redoStack.length;
}

export function getCommandHistoryUndoLabel(history: Readonly<CommandHistory>): string | null {
  const stack = history.undoStack;
  return stack.length > 0 ? stack[stack.length - 1].label : null;
}

export function getCommandHistoryRedoLabel(history: Readonly<CommandHistory>): string | null {
  const stack = history.redoStack;
  return stack.length > 0 ? stack[stack.length - 1].label : null;
}

export function markCommandHistoryClean(history: CommandHistory): void {
  history.cleanIndex = history.undoStack.length;
}

export function isCommandHistoryClean(history: Readonly<CommandHistory>): boolean {
  return history.undoStack.length === history.cleanIndex;
}
