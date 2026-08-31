export {
  clearActiveSmartGuides,
  createSmartGuideState,
  getActiveSmartGuideCount,
  getActiveSmartGuides,
  getSmartGuideVersion,
  isSmartGuidesEnabled,
  isSpacingGuidesEnabled,
  setActiveSmartGuides,
  setSmartGuidesEnabled,
  setSpacingGuidesEnabled,
} from './smartGuideState';

export type { SmartGuide, SmartGuideKind, SmartGuideOrientation, SmartGuideState } from './smartGuideState';
export { matchSmartGuides, validateSmartGuides } from './smartGuideGeometry';
export type { SmartGuideBounds, SmartGuideMatch, SmartGuideTarget } from './smartGuideGeometry';
