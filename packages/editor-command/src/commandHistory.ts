export interface Command {
  readonly label: string;
  execute(): void;
  undo(): void;
}

export interface CoalescingCommand extends Command {
  readonly coalesceKey: string;
  mergeWith(next: CoalescingCommand): CoalescingCommand | null;
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
  assertCommand(command);
  command.execute();
  invalidateCleanBranch(history);
  history.undoStack.push(command);
  history.redoStack.length = 0;
}

export function undo(history: CommandHistory): boolean {
  const command = history.undoStack[history.undoStack.length - 1];
  if (command === undefined) return false;
  command.undo();
  history.undoStack.pop();
  history.redoStack.push(command);
  return true;
}

export function redo(history: CommandHistory): boolean {
  const command = history.redoStack[history.redoStack.length - 1];
  if (command === undefined) return false;
  command.execute();
  history.redoStack.pop();
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
  return history.cleanIndex >= 0 && history.undoStack.length === history.cleanIndex;
}

function assertCommand(command: Command): void {
  if (command.label.trim() === '') throw new TypeError('Command label must not be empty');
}

function invalidateCleanBranch(history: CommandHistory): void {
  if (history.redoStack.length > 0 && history.cleanIndex > history.undoStack.length) {
    history.cleanIndex = -1;
  }
}

export function executeCommandBatch(history: CommandHistory, label: string, commands: readonly Command[]): boolean {
  if (commands.length === 0) return false;
  const batch = createCommandBatch(label, commands);
  executeCommand(history, batch);
  return true;
}

export function createCommandBatch(label: string, commands: readonly Command[]): Command {
  if (label.trim() === '') throw new TypeError('Command batch label must not be empty');
  const owned = commands.slice();
  owned.forEach(assertCommand);
  return {
    label,
    execute() {
      const completed: Command[] = [];
      try {
        for (const command of owned) {
          command.execute();
          completed.push(command);
        }
      } catch (error) {
        for (let index = completed.length - 1; index >= 0; index--) completed[index]!.undo();
        throw error;
      }
    },
    undo() {
      const undone: Command[] = [];
      try {
        for (let index = owned.length - 1; index >= 0; index--) {
          owned[index]!.undo();
          undone.push(owned[index]!);
        }
      } catch (error) {
        for (let index = undone.length - 1; index >= 0; index--) undone[index]!.execute();
        throw error;
      }
    },
  };
}

export function executeCoalescingCommand(history: CommandHistory, command: CoalescingCommand): void {
  assertCommand(command);
  command.execute();
  const previous = history.undoStack[history.undoStack.length - 1];
  if (
    previous !== undefined &&
    'coalesceKey' in previous &&
    typeof previous.coalesceKey === 'string' &&
    previous.coalesceKey === command.coalesceKey &&
    'mergeWith' in previous &&
    typeof previous.mergeWith === 'function'
  ) {
    const merged = (previous as CoalescingCommand).mergeWith(command);
    if (merged !== null) {
      assertCommand(merged);
      history.undoStack[history.undoStack.length - 1] = merged;
      history.redoStack.length = 0;
      return;
    }
  }
  invalidateCleanBranch(history);
  history.undoStack.push(command);
  history.redoStack.length = 0;
}
