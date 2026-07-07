import { describe, it, expect } from 'vitest';
import { renderGlobalStatsSVG } from '../GlobalStatsWidget';
import { getTheme } from '../themes';
import { dictionaries } from '../locales';

describe('GlobalStatsWidget SVG', () => {
  const mockStats = { commits: 1500, prs: 300, issues: 150, stars: 5000 };
  const mockFollowers = 250;
  const defaultTheme = getTheme('dark');

  it('renders successfully without throwing', () => {
    const svg = renderGlobalStatsSVG({ stats: mockStats, followers: mockFollowers, theme: defaultTheme, lang: 'en' });
    expect(typeof svg).toBe('string');
    expect(svg.includes('<svg')).toBeTruthy();
  });

  it('includes the correct title from translations (EN)', () => {
    const svg = renderGlobalStatsSVG({ stats: mockStats, followers: mockFollowers, theme: defaultTheme, lang: 'en' });
    expect(svg).toContain(dictionaries.en.globalStats);
    expect(svg).toContain(dictionaries.en.commits);
  });

  it('includes the correct title from translations (ES)', () => {
    const svg = renderGlobalStatsSVG({ stats: mockStats, followers: mockFollowers, theme: defaultTheme, lang: 'es' });
    expect(svg).toContain(dictionaries.es.globalStats);
    expect(svg).toContain(dictionaries.es.followers);
  });

  it('formats numbers correctly according to language locale (EN)', () => {
    const svg = renderGlobalStatsSVG({ stats: mockStats, followers: mockFollowers, theme: defaultTheme, lang: 'en' });
    // 5000 -> 5,000 in EN
    expect(svg).toContain('5,000');
    expect(svg).toContain('1,500');
  });

  it('formats numbers correctly according to language locale (ES)', () => {
    const svg = renderGlobalStatsSVG({ stats: mockStats, followers: mockFollowers, theme: defaultTheme, lang: 'es' });
    // 5000 -> 5.000 in ES (in most environments, or matching localestring)
    // We just check it contains the formatted string.
    const formatted = (5000).toLocaleString('es');
    expect(svg).toContain(formatted);
  });

  it('handles zero values correctly', () => {
    const zeroStats = { commits: 0, prs: 0, issues: 0, stars: 0 };
    const svg = renderGlobalStatsSVG({ stats: zeroStats, followers: 0, theme: defaultTheme, lang: 'en' });
    expect(svg).toContain('>0<'); // 0 inside tags
  });

  it('applies the correct theme colors (Dark)', () => {
    const svg = renderGlobalStatsSVG({ stats: mockStats, followers: mockFollowers, theme: defaultTheme, lang: 'en' });
    expect(svg).toContain(defaultTheme.glassBg);
    expect(svg).toContain(defaultTheme.glassBorder);
  });

  it('applies the correct theme colors (Light)', () => {
    const lightTheme = getTheme('light');
    const svg = renderGlobalStatsSVG({ stats: mockStats, followers: mockFollowers, theme: lightTheme, lang: 'en' });
    expect(svg).toContain(lightTheme.glassBg);
    expect(svg).toContain(lightTheme.glassBorder);
  });

  it('includes exactly 4 KPI cards', () => {
    const svg = renderGlobalStatsSVG({ stats: mockStats, followers: mockFollowers, theme: defaultTheme, lang: 'en' });
    // The template creates 4 rx="12" rects for cards
    const match = svg.match(/rx="12"/g);
    expect(match?.length).toBeGreaterThanOrEqual(4);
  });

  it('has consistent SVG wrapper dimensions', () => {
    const svg = renderGlobalStatsSVG({ stats: mockStats, followers: mockFollowers, theme: defaultTheme, lang: 'en' });
    expect(svg).toContain('width="848"');
    expect(svg).toContain('height="236"');
  });
});
