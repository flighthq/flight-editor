import type { GlRenderState } from '@flighthq/types';

import { registerRenderer } from '@flighthq/render';
import {
  defaultGlShapeCommands,
  defaultGlShapeRenderer,
  defaultGlSpriteRenderer,
  defaultGlTextLabelRenderer,
  registerGlColorAdjustmentMaterialFeature,
  registerGlShapeCommands,
  registerGlStandardMaterial,
} from '@flighthq/scene2d-gl';
import { registerDefaultShapeBoundsCommands } from '@flighthq/shape';
import { ShapeKind, SpriteKind, TextLabelKind } from '@flighthq/types';

export function registerGlRenderers(state: GlRenderState): void {
  registerDefaultShapeBoundsCommands();
  registerGlStandardMaterial(state);
  registerGlColorAdjustmentMaterialFeature(state);
  registerGlShapeCommands(state, defaultGlShapeCommands);
  registerRenderer(state, ShapeKind, defaultGlShapeRenderer);
  registerRenderer(state, SpriteKind, defaultGlSpriteRenderer);
  registerRenderer(state, TextLabelKind, defaultGlTextLabelRenderer);
}
