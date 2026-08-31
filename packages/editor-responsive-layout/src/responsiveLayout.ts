import type { Command } from '@flighthq/editor-command';

import { createSnapshotCommand } from '@flighthq/editor-command';

export type LayoutDirection = 'horizontal' | 'vertical';
export type LayoutSizing = 'fixed' | 'fill' | 'hug';
export type LayoutAlignment = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type LayoutPin = 'left' | 'right' | 'top' | 'bottom' | 'center-x' | 'center-y' | 'scale-x' | 'scale-y';
export type LayoutGestureIntent = 'move' | 'reorder' | 'resize' | 'scale';

export interface LayoutInsets {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export interface LayoutContainerRule {
  readonly nodeId: string;
  direction: LayoutDirection;
  wrap: boolean;
  rowGap: number;
  columnGap: number;
  padding: LayoutInsets;
  primaryAlignment: Exclude<LayoutAlignment, 'baseline'>;
  crossAlignment: LayoutAlignment;
  widthSizing: LayoutSizing;
  heightSizing: LayoutSizing;
  childOrder: string[];
}

export interface LayoutChildRule {
  readonly nodeId: string;
  readonly parentId: string;
  widthSizing: LayoutSizing;
  heightSizing: LayoutSizing;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  absolute: boolean;
  pins: LayoutPin[];
}

export interface ResponsiveLayoutState {
  containers: Map<string, LayoutContainerRule>;
  children: Map<string, LayoutChildRule>;
  version: number;
}

export interface LayoutDiagnostic {
  readonly code: 'duplicate-child' | 'invalid-range' | 'missing-child' | 'missing-parent' | 'over-constrained';
  readonly nodeId: string;
  readonly message: string;
}

export interface LayoutControlledField {
  readonly field: 'x' | 'y' | 'width' | 'height';
  readonly controlled: boolean;
  readonly reason: string | null;
}

export interface SerializedResponsiveLayout {
  readonly containers: readonly LayoutContainerRule[];
  readonly children: readonly LayoutChildRule[];
}

function finiteNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${label} must be finite and non-negative`);
}

function cloneContainer(rule: Readonly<LayoutContainerRule>): LayoutContainerRule {
  return { ...rule, padding: { ...rule.padding }, childOrder: rule.childOrder.slice() };
}

function cloneChild(rule: Readonly<LayoutChildRule>): LayoutChildRule {
  return { ...rule, pins: rule.pins.slice() };
}

function validateContainerInput(rule: Readonly<LayoutContainerRule>): void {
  if (rule.nodeId.trim() === '') throw new TypeError('Layout container id must not be empty');
  finiteNonNegative(rule.rowGap, 'Row gap');
  finiteNonNegative(rule.columnGap, 'Column gap');
  for (const [side, value] of Object.entries(rule.padding)) finiteNonNegative(value, `${side} padding`);
}

export function createResponsiveLayoutState(): ResponsiveLayoutState {
  return { containers: new Map(), children: new Map(), version: 0 };
}

export function setLayoutContainer(state: ResponsiveLayoutState, rule: Readonly<LayoutContainerRule>): void {
  validateContainerInput(rule);
  if (new Set(rule.childOrder).size !== rule.childOrder.length) throw new Error('Layout child order must be unique');
  state.containers.set(rule.nodeId, cloneContainer(rule));
  state.version++;
}

export function setLayoutChild(state: ResponsiveLayoutState, rule: Readonly<LayoutChildRule>): void {
  if (rule.nodeId.trim() === '' || rule.parentId.trim() === '')
    throw new TypeError('Layout child identity must not be empty');
  const pins = Array.from(new Set(rule.pins));
  state.children.set(rule.nodeId, { ...cloneChild(rule), pins });
  const parent = state.containers.get(rule.parentId);
  if (parent !== undefined && !parent.childOrder.includes(rule.nodeId)) parent.childOrder.push(rule.nodeId);
  state.version++;
}

export function removeLayoutRule(state: ResponsiveLayoutState, nodeId: string): boolean {
  const removed = state.containers.delete(nodeId) || state.children.delete(nodeId);
  if (!removed) return false;
  state.children.delete(nodeId);
  for (const container of state.containers.values()) {
    container.childOrder = container.childOrder.filter((id) => id !== nodeId);
  }
  state.version++;
  return true;
}

export function reorderLayoutChild(
  state: ResponsiveLayoutState,
  parentId: string,
  childId: string,
  targetIndex: number,
): boolean {
  const parent = state.containers.get(parentId);
  if (parent === undefined || !Number.isSafeInteger(targetIndex)) return false;
  const current = parent.childOrder.indexOf(childId);
  if (current < 0) return false;
  const clamped = Math.max(0, Math.min(targetIndex, parent.childOrder.length - 1));
  if (current === clamped) return false;
  parent.childOrder.splice(current, 1);
  parent.childOrder.splice(clamped, 0, childId);
  state.version++;
  return true;
}

export function inferLayoutPins(
  parent: Readonly<{ width: number; height: number }>,
  child: Readonly<{ x: number; y: number; width: number; height: number }>,
  tolerance = 1,
): readonly LayoutPin[] {
  finiteNonNegative(tolerance, 'Inference tolerance');
  const pins: LayoutPin[] = [];
  if (Math.abs(child.x) <= tolerance) pins.push('left');
  if (Math.abs(parent.width - child.x - child.width) <= tolerance) pins.push('right');
  if (Math.abs(child.y) <= tolerance) pins.push('top');
  if (Math.abs(parent.height - child.y - child.height) <= tolerance) pins.push('bottom');
  if (Math.abs(child.x + child.width / 2 - parent.width / 2) <= tolerance) pins.push('center-x');
  if (Math.abs(child.y + child.height / 2 - parent.height / 2) <= tolerance) pins.push('center-y');
  return pins;
}

export function getLayoutControlledFields(
  state: Readonly<ResponsiveLayoutState>,
  nodeId: string,
): readonly LayoutControlledField[] {
  const child = state.children.get(nodeId);
  if (child === undefined) {
    const fields: readonly LayoutControlledField['field'][] = ['x', 'y', 'width', 'height'];
    return fields.map((field) => ({ field, controlled: false, reason: null }));
  }
  const parent = state.containers.get(child.parentId);
  const flow = parent !== undefined && !child.absolute;
  return [
    { field: 'x', controlled: flow, reason: flow ? 'Position is controlled by parent flow' : null },
    { field: 'y', controlled: flow, reason: flow ? 'Position is controlled by parent flow' : null },
    {
      field: 'width',
      controlled: child.widthSizing !== 'fixed',
      reason: child.widthSizing === 'fixed' ? null : `Width uses ${child.widthSizing} sizing`,
    },
    {
      field: 'height',
      controlled: child.heightSizing !== 'fixed',
      reason: child.heightSizing === 'fixed' ? null : `Height uses ${child.heightSizing} sizing`,
    },
  ];
}

export function getLayoutGestureIntent(
  state: Readonly<ResponsiveLayoutState>,
  nodeId: string,
  gesture: 'drag' | 'resize',
  scaleModifier = false,
): LayoutGestureIntent {
  if (gesture === 'resize') return scaleModifier ? 'scale' : 'resize';
  const child = state.children.get(nodeId);
  return child !== undefined && !child.absolute && state.containers.has(child.parentId) ? 'reorder' : 'move';
}

export function validateResponsiveLayout(state: Readonly<ResponsiveLayoutState>): readonly LayoutDiagnostic[] {
  const diagnostics: LayoutDiagnostic[] = [];
  for (const child of state.children.values()) {
    if (!state.containers.has(child.parentId)) {
      diagnostics.push({
        code: 'missing-parent',
        nodeId: child.nodeId,
        message: `Parent not found: ${child.parentId}`,
      });
    }
    for (const [axis, min, max] of [
      ['width', child.minWidth, child.maxWidth],
      ['height', child.minHeight, child.maxHeight],
    ] as const) {
      if (min !== undefined && max !== undefined && min > max) {
        diagnostics.push({ code: 'invalid-range', nodeId: child.nodeId, message: `Minimum ${axis} exceeds maximum` });
      }
    }
    if (child.widthSizing === 'fill' && child.pins.includes('left') && child.pins.includes('right')) {
      diagnostics.push({
        code: 'over-constrained',
        nodeId: child.nodeId,
        message: 'Fill width conflicts with both horizontal pins',
      });
    }
    if (child.heightSizing === 'fill' && child.pins.includes('top') && child.pins.includes('bottom')) {
      diagnostics.push({
        code: 'over-constrained',
        nodeId: child.nodeId,
        message: 'Fill height conflicts with both vertical pins',
      });
    }
  }
  for (const container of state.containers.values()) {
    const seen = new Set<string>();
    for (const childId of container.childOrder) {
      if (seen.has(childId))
        diagnostics.push({ code: 'duplicate-child', nodeId: childId, message: 'Child appears more than once' });
      else if (state.children.get(childId)?.parentId !== container.nodeId) {
        diagnostics.push({
          code: 'missing-child',
          nodeId: childId,
          message: `Child is not assigned to ${container.nodeId}`,
        });
      }
      seen.add(childId);
    }
  }
  return diagnostics.sort((a, b) => a.nodeId.localeCompare(b.nodeId) || a.code.localeCompare(b.code));
}

export function serializeResponsiveLayout(state: Readonly<ResponsiveLayoutState>): SerializedResponsiveLayout {
  return {
    containers: Array.from(state.containers.values())
      .sort((a, b) => a.nodeId.localeCompare(b.nodeId))
      .map(cloneContainer),
    children: Array.from(state.children.values())
      .sort((a, b) => a.nodeId.localeCompare(b.nodeId))
      .map(cloneChild),
  };
}

export function restoreResponsiveLayout(
  state: ResponsiveLayoutState,
  value: Readonly<SerializedResponsiveLayout>,
): void {
  const next = createResponsiveLayoutState();
  for (const container of value.containers) setLayoutContainer(next, container);
  for (const child of value.children) setLayoutChild(next, child);
  const diagnostics = validateResponsiveLayout(next);
  if (diagnostics.length > 0) throw new Error(`Invalid responsive layout: ${diagnostics[0]!.message}`);
  state.containers = next.containers;
  state.children = next.children;
  state.version++;
}

export function createResponsiveLayoutCommand(
  state: ResponsiveLayoutState,
  label: string,
  mutate: () => void,
): Command {
  return createSnapshotCommand(
    label,
    {
      capture: () => serializeResponsiveLayout(state),
      restore: (snapshot) => restoreResponsiveLayout(state, snapshot),
    },
    mutate,
  );
}
