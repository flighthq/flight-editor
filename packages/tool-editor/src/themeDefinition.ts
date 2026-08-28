export interface ThemeColors {
  readonly background: number;
  readonly surface: number;
  readonly surfaceAlt: number;
  readonly border: number;
  readonly text: number;
  readonly textMuted: number;
  readonly accent: number;
  readonly accentHover: number;
  readonly selection: number;
  readonly error: number;
  readonly warning: number;
}

export interface ThemeSpacing {
  readonly xs: number;
  readonly sm: number;
  readonly md: number;
  readonly lg: number;
  readonly xl: number;
}

export interface ThemeSizes {
  readonly iconSm: number;
  readonly iconMd: number;
  readonly iconLg: number;
  readonly fontSize: number;
  readonly fontSizeSm: number;
  readonly fontSizeLg: number;
  readonly borderRadius: number;
  readonly borderWidth: number;
}

export interface EditorTheme {
  readonly name: string;
  readonly colors: ThemeColors;
  readonly spacing: ThemeSpacing;
  readonly sizes: ThemeSizes;
}

export function createDarkTheme(): EditorTheme {
  return {
    name: 'dark',
    colors: {
      background: 0x1e1e1eff,
      surface: 0x2d2d2dff,
      surfaceAlt: 0x383838ff,
      border: 0x4a4a4aff,
      text: 0xccccccff,
      textMuted: 0x888888ff,
      accent: 0x0078d4ff,
      accentHover: 0x1a8ae8ff,
      selection: 0x264f78ff,
      error: 0xf44747ff,
      warning: 0xe8ab53ff,
    },
    spacing: { xs: 2, sm: 4, md: 8, lg: 16, xl: 24 },
    sizes: {
      iconSm: 12,
      iconMd: 16,
      iconLg: 24,
      fontSize: 13,
      fontSizeSm: 11,
      fontSizeLg: 16,
      borderRadius: 4,
      borderWidth: 1,
    },
  };
}

export function createLightTheme(): EditorTheme {
  return {
    name: 'light',
    colors: {
      background: 0xf3f3f3ff,
      surface: 0xffffffff,
      surfaceAlt: 0xe8e8e8ff,
      border: 0xd4d4d4ff,
      text: 0x333333ff,
      textMuted: 0x777777ff,
      accent: 0x0078d4ff,
      accentHover: 0x106ebeff,
      selection: 0xadd6ffff,
      error: 0xd32f2fff,
      warning: 0xf57c00ff,
    },
    spacing: { xs: 2, sm: 4, md: 8, lg: 16, xl: 24 },
    sizes: {
      iconSm: 12,
      iconMd: 16,
      iconLg: 24,
      fontSize: 13,
      fontSizeSm: 11,
      fontSizeLg: 16,
      borderRadius: 4,
      borderWidth: 1,
    },
  };
}

export function getThemeColor(theme: Readonly<EditorTheme>, key: keyof ThemeColors): number {
  return theme.colors[key];
}

export function mergeTheme(base: Readonly<EditorTheme>, overrides: Partial<EditorTheme>): EditorTheme {
  return {
    name: overrides.name ?? base.name,
    colors: overrides.colors ? { ...base.colors, ...overrides.colors } : base.colors,
    spacing: overrides.spacing ? { ...base.spacing, ...overrides.spacing } : base.spacing,
    sizes: overrides.sizes ? { ...base.sizes, ...overrides.sizes } : base.sizes,
  };
}
