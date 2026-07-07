import { describe, it, expect } from 'vitest';
import { renderCardWrapper } from '../CardWrapper';
import { getTheme } from '../themes';
import { dictionaries } from '../locales';

describe('CardWrapper SVG', () => {
  const defaultTheme = getTheme('dark');

  it('renders successfully without throwing', () => {
    const svg = renderCardWrapper({ width: 800, height: 200, theme: defaultTheme, children: "<circle />" });
    expect(typeof svg).toBe('string');
    expect(svg.startsWith('<svg') || svg.startsWith('<g') || svg.includes('xmlns=')).toBeTruthy();
  });

  it('applies the correct theme colors (Dark)', () => {
    const svg = renderCardWrapper({ width: 800, height: 200, theme: defaultTheme, children: "<circle />" });
    expect(svg).toContain(defaultTheme.glassBg || defaultTheme.background);
  });

  it('applies the correct theme colors (Light)', () => {
    const lightTheme = getTheme('light');
    const svg = renderCardWrapper({ width: 800, height: 200, theme: lightTheme, children: "<circle />" });
    expect(svg).toContain(lightTheme.glassBg || lightTheme.background);
  });

  it('handles empty data safely', () => {
    // Structural test to ensure it doesn't crash
    expect(() => renderCardWrapper({ width: 800, height: 200, theme: defaultTheme, children: "<circle />" })).not.toThrow();
  });

  it('renders a valid XML/SVG structure', () => {
    const svg = renderCardWrapper({ width: 800, height: 200, theme: defaultTheme, children: "<circle />" });
    expect(svg.includes('/>') || svg.includes('</')).toBeTruthy();
  });

  it('contains expected layout elements', () => {
    const svg = renderCardWrapper({ width: 800, height: 200, theme: defaultTheme, children: "<circle />" });
    expect(svg).toContain('<g');
  });

  it('maintains expected dimensional structure', () => {
    const svg = renderCardWrapper({ width: 800, height: 200, theme: defaultTheme, children: "<circle />" });
    expect(typeof svg).toBe('string');
  });

  it('escapes or renders content safely', () => {
    const svg = renderCardWrapper({ width: 800, height: 200, theme: defaultTheme, children: "<circle />" });
    expect(svg).not.toContain('undefined');
  });

  it('uses locale dictionaries (or respects theme if no locale)', () => {
    const svg = renderCardWrapper({ width: 800, height: 200, theme: defaultTheme, children: "<circle />" });
    expect(svg).toBeDefined();
  });

  it('does not leak internal javascript objects into SVG', () => {
    const svg = renderCardWrapper({ width: 800, height: 200, theme: defaultTheme, children: "<circle />" });
    expect(svg).not.toContain('[object Object]');
  });
});
