export type Platform = 'mac' | 'windows' | 'linux';

export interface ShortcutParts {
  readonly ctrl?: boolean;
  readonly shift?: boolean;
  readonly alt?: boolean;
  readonly meta?: boolean;
  readonly key: string;
}

export function formatShortcut(parts: Readonly<ShortcutParts>, platform: Platform = 'mac'): string {
  const mods: string[] = [];

  if (platform === 'mac') {
    if (parts.ctrl) mods.push('⌃');
    if (parts.alt) mods.push('⌥');
    if (parts.shift) mods.push('⇧');
    if (parts.meta) mods.push('⌘');
  } else {
    if (parts.ctrl || parts.meta) mods.push('Ctrl');
    if (parts.alt) mods.push('Alt');
    if (parts.shift) mods.push('Shift');
  }

  const keyLabel = formatKeyLabel(parts.key, platform);
  if (platform === 'mac') {
    return mods.join('') + keyLabel;
  }
  mods.push(keyLabel);
  return mods.join('+');
}

export function parseShortcutString(shortcut: string): ShortcutParts {
  const parts = shortcut.split('+').map((s) => s.trim().toLowerCase());
  const key = parts.pop() ?? '';
  return {
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt') || parts.includes('option'),
    meta: parts.includes('meta') || parts.includes('cmd') || parts.includes('command'),
    key: key.length === 1 ? key.toUpperCase() : key,
  };
}

export function shortcutMatchesEvent(
  parts: Readonly<ShortcutParts>,
  event: Readonly<{ ctrlKey: boolean; shiftKey: boolean; altKey: boolean; metaKey: boolean; key: string }>,
): boolean {
  if ((parts.ctrl ?? false) !== event.ctrlKey) return false;
  if ((parts.shift ?? false) !== event.shiftKey) return false;
  if ((parts.alt ?? false) !== event.altKey) return false;
  if ((parts.meta ?? false) !== event.metaKey) return false;
  return event.key.toLowerCase() === parts.key.toLowerCase();
}

function formatKeyLabel(key: string, platform: Platform): string {
  const upper = key.toUpperCase();
  if (platform === 'mac') {
    switch (upper) {
      case 'BACKSPACE':
      case 'DELETE':
        return '⌫';
      case 'ENTER':
      case 'RETURN':
        return '↩';
      case 'ESCAPE':
        return '⎋';
      case 'TAB':
        return '⇥';
      case 'ARROWUP':
        return '↑';
      case 'ARROWDOWN':
        return '↓';
      case 'ARROWLEFT':
        return '←';
      case 'ARROWRIGHT':
        return '→';
      case ' ':
        return 'Space';
      default:
        return key.length === 1 ? upper : key;
    }
  }
  switch (upper) {
    case 'BACKSPACE':
      return 'Backspace';
    case 'DELETE':
      return 'Del';
    case 'ENTER':
    case 'RETURN':
      return 'Enter';
    case 'ESCAPE':
      return 'Esc';
    case 'ARROWUP':
      return '↑';
    case 'ARROWDOWN':
      return '↓';
    case 'ARROWLEFT':
      return '←';
    case 'ARROWRIGHT':
      return '→';
    case ' ':
      return 'Space';
    default:
      return key.length === 1 ? upper : key;
  }
}
