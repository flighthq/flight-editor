import { describe, expect, it } from 'vitest';

import { createDarkTheme, createLightTheme, getThemeColor, mergeTheme } from './themeDefinition';

describe('createDarkTheme', () => {
  it('returns a theme named dark', () => {
    const theme = createDarkTheme();
    expect(theme.name).toBe('dark');
  });

  it('has dark background color', () => {
    const theme = createDarkTheme();
    expect(theme.colors.background).toBe(0x1e1e1eff);
  });

  it('includes all spacing values', () => {
    const theme = createDarkTheme();
    expect(theme.spacing.xs).toBe(2);
    expect(theme.spacing.sm).toBe(4);
    expect(theme.spacing.md).toBe(8);
    expect(theme.spacing.lg).toBe(16);
    expect(theme.spacing.xl).toBe(24);
  });

  it('includes all size values', () => {
    const theme = createDarkTheme();
    expect(theme.sizes.fontSize).toBe(13);
    expect(theme.sizes.borderRadius).toBe(4);
  });
});

describe('createLightTheme', () => {
  it('returns a theme named light', () => {
    const theme = createLightTheme();
    expect(theme.name).toBe('light');
  });

  it('has light background color', () => {
    const theme = createLightTheme();
    expect(theme.colors.background).toBe(0xf3f3f3ff);
  });

  it('shares spacing values with dark theme', () => {
    const dark = createDarkTheme();
    const light = createLightTheme();
    expect(light.spacing).toEqual(dark.spacing);
  });
});

describe('getThemeColor', () => {
  it('returns accent color', () => {
    const theme = createDarkTheme();
    expect(getThemeColor(theme, 'accent')).toBe(0x0078d4ff);
  });

  it('returns text color', () => {
    const theme = createDarkTheme();
    expect(getThemeColor(theme, 'text')).toBe(0xccccccff);
  });
});

describe('mergeTheme', () => {
  it('overrides name', () => {
    const base = createDarkTheme();
    const merged = mergeTheme(base, { name: 'custom' });
    expect(merged.name).toBe('custom');
  });

  it('overrides individual colors', () => {
    const base = createDarkTheme();
    const merged = mergeTheme(base, { colors: { ...base.colors, accent: 0xff0000ff } });
    expect(merged.colors.accent).toBe(0xff0000ff);
    expect(merged.colors.background).toBe(base.colors.background);
  });

  it('preserves base when no overrides', () => {
    const base = createDarkTheme();
    const merged = mergeTheme(base, {});
    expect(merged.colors).toBe(base.colors);
    expect(merged.spacing).toBe(base.spacing);
    expect(merged.sizes).toBe(base.sizes);
  });

  it('overrides spacing', () => {
    const base = createDarkTheme();
    const merged = mergeTheme(base, { spacing: { ...base.spacing, md: 12 } });
    expect(merged.spacing.md).toBe(12);
    expect(merged.spacing.sm).toBe(4);
  });
});
