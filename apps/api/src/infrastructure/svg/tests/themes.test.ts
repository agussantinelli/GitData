import { describe, it, expect } from 'vitest';
import { themes, getTheme, SVGTheme } from '../themes';

describe('themes (SVG)', () => {
  it('exports dark and light themes', () => {
    expect(themes).toHaveProperty('dark');
    expect(themes).toHaveProperty('light');
  });

  it('has identical structure for all themes', () => {
    const darkKeys = Object.keys(themes.dark).sort();
    const lightKeys = Object.keys(themes.light).sort();
    expect(darkKeys).toEqual(lightKeys);
  });

  it('has valid background URLs', () => {
    expect(themes.dark.background).toContain('url(#');
    expect(themes.light.background).toContain('url(#');
  });

  it('provides a valid text color in light theme', () => {
    expect(themes.light.textColor.startsWith('#')).toBeTruthy();
  });

  it('provides a valid text color in dark theme', () => {
    expect(themes.dark.textColor.startsWith('#')).toBeTruthy();
  });

  describe('getTheme()', () => {
    it('returns the dark theme when asked explicitly', () => {
      const theme = getTheme('dark');
      expect(theme).toEqual(themes.dark);
    });

    it('returns the light theme when asked explicitly', () => {
      const theme = getTheme('light');
      expect(theme).toEqual(themes.light);
    });

    it('returns the dark theme when an unknown theme is passed', () => {
      const theme = getTheme('unknown-theme');
      expect(theme).toEqual(themes.dark); // Fallback is dark
    });

    it('returns the dark theme when undefined is passed', () => {
      const theme = getTheme(undefined);
      expect(theme).toEqual(themes.dark); // Fallback is dark
    });

    it('returns a full SVGTheme interface compliance', () => {
      const theme = getTheme();
      expect(theme).toHaveProperty('background');
      expect(theme).toHaveProperty('borderColor');
      expect(theme).toHaveProperty('titleColor');
      expect(theme).toHaveProperty('textColor');
      expect(theme).toHaveProperty('textMutedColor');
      expect(theme).toHaveProperty('iconColor');
      expect(theme).toHaveProperty('primaryColor');
      expect(theme).toHaveProperty('glassBg');
      expect(theme).toHaveProperty('glassBorder');
    });
  });
});
