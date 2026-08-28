export interface KeyBinding {
  readonly key: string;
  readonly ctrl?: boolean;
  readonly shift?: boolean;
  readonly alt?: boolean;
  readonly meta?: boolean;
}

export interface KeyboardMap {
  bindings: Map<string, KeyBinding>;
  version: number;
}

export interface KeyboardEventLike {
  readonly key: string;
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
}

export function createKeyboardMap(): KeyboardMap {
  return { bindings: new Map(), version: 0 };
}

export function registerKeyBinding(map: KeyboardMap, actionId: string, binding: Readonly<KeyBinding>): void {
  map.bindings.set(actionId, { ...binding });
  map.version++;
}

export function unregisterKeyBinding(map: KeyboardMap, actionId: string): void {
  if (map.bindings.delete(actionId)) {
    map.version++;
  }
}

export function getKeyBinding(map: Readonly<KeyboardMap>, actionId: string): KeyBinding | null {
  return map.bindings.get(actionId) ?? null;
}

export function matchKeyEvent(map: Readonly<KeyboardMap>, event: Readonly<KeyboardEventLike>): string | null {
  const eventKey = event.key.toLowerCase();

  for (const [actionId, binding] of map.bindings) {
    if (
      binding.key.toLowerCase() === eventKey &&
      (binding.ctrl ?? false) === event.ctrlKey &&
      (binding.shift ?? false) === event.shiftKey &&
      (binding.alt ?? false) === event.altKey &&
      (binding.meta ?? false) === event.metaKey
    ) {
      return actionId;
    }
  }

  return null;
}

export function getRegisteredActions(map: Readonly<KeyboardMap>): readonly string[] {
  return Array.from(map.bindings.keys());
}
