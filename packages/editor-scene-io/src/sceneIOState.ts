import type { DocumentFormat } from '@flighthq/editor-document';
import type { Scene2D } from '@flighthq/types';

export interface PendingLoadOperation {
  readonly format: DocumentFormat;
}

export interface PendingSaveOperation {
  readonly scene: Scene2D;
  readonly format: DocumentFormat;
}

export interface SceneIOState {
  pendingLoad: PendingLoadOperation | null;
  pendingSave: PendingSaveOperation | null;
  loadedScene: Scene2D | null;
  loadError: string | null;
  saveError: string | null;
  format: DocumentFormat;
  version: number;
}

export function createSceneIOState(): SceneIOState {
  return {
    pendingLoad: null,
    pendingSave: null,
    loadedScene: null,
    loadError: null,
    saveError: null,
    format: 'flight',
    version: 0,
  };
}

export function startLoad(state: SceneIOState, format: DocumentFormat = state.format): void {
  if (state.pendingLoad?.format === format && state.loadError === null && state.format === format) return;
  state.pendingLoad = { format };
  state.loadError = null;
  state.format = format;
  state.version++;
}

export function completeLoad(state: SceneIOState, scene: Scene2D): void {
  if (state.pendingLoad === null) return;
  state.pendingLoad = null;
  state.loadedScene = scene;
  state.loadError = null;
  state.version++;
}

export function failLoad(state: SceneIOState, message: string): void {
  if (state.pendingLoad === null) return;
  state.pendingLoad = null;
  state.loadError = message;
  state.version++;
}

export function startSave(state: SceneIOState, scene: Scene2D, format: DocumentFormat = state.format): void {
  if (
    state.pendingSave?.scene === scene &&
    state.pendingSave.format === format &&
    state.saveError === null &&
    state.format === format
  ) {
    return;
  }
  state.pendingSave = { scene, format };
  state.saveError = null;
  state.format = format;
  state.version++;
}

export function completeSave(state: SceneIOState): void {
  if (state.pendingSave === null) return;
  state.pendingSave = null;
  state.saveError = null;
  state.version++;
}

export function failSave(state: SceneIOState, message: string): void {
  if (state.pendingSave === null) return;
  state.pendingSave = null;
  state.saveError = message;
  state.version++;
}

export function getLoadError(state: Readonly<SceneIOState>): string | null {
  return state.loadError;
}

export function getSaveError(state: Readonly<SceneIOState>): string | null {
  return state.saveError;
}

export function isLoading(state: Readonly<SceneIOState>): boolean {
  return state.pendingLoad !== null;
}

export function isSaving(state: Readonly<SceneIOState>): boolean {
  return state.pendingSave !== null;
}

export function getSceneIOVersion(state: Readonly<SceneIOState>): number {
  return state.version;
}
