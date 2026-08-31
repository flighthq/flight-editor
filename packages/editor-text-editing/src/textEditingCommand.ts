import type { Command } from '@flighthq/editor-command';
import type { TextEditCommit } from './textEditingState';

export function createTextEditCommand(
  commit: TextEditCommit,
  write: (targetId: string, text: string, baseRevision: number) => void,
): Command {
  if (commit.targetId.trim() === '') throw new TypeError('Text command target identity must not be empty');
  return {
    label: 'Edit text',
    execute() {
      write(commit.targetId, commit.after, commit.baseRevision);
    },
    undo() {
      write(commit.targetId, commit.before, commit.baseRevision);
    },
  };
}
