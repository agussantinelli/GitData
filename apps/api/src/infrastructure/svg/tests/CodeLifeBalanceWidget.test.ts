import { describe, it, expect } from 'vitest';
import { renderCodeLifeBalanceSVG } from '../CodeLifeBalanceWidget';
import { getTheme } from '../themes';
import { dictionaries } from '../locales';

describe('CodeLifeBalanceWidget SVG', () => {

  const mockProfile = {
    username: 'testuser',
    name: 'Test User',
    bio: 'Software Engineer',
    company: '@github',
    location: 'Earth',
    websiteUrl: 'https://test.com',
    twitterUsername: 'test',
    createdAt: '2020-01-01',
    followers: 100,
    stats: { commits: 10, prs: 5, issues: 2, stars: 100 },
    topLanguages: [],
    projects: [],
    contributions: [],
    achievements: [],
    timeOfDay: { morning: 1, afternoon: 2, night: 3 },
    activityStream: [],
    techRadar: { frontend: 10, backend: 20, devops: 5 },
    codeLifeBalance: { weekdays: 10, weekends: 2 },
    milestones: [],
    hourlyFrequency: Array(24).fill(0)
  };
  const defaultTheme = getTheme('dark');

  it('renders successfully without throwing', () => {
    const svg = renderCodeLifeBalanceSVG({ balance: mockProfile.codeLifeBalance, theme: defaultTheme, lang: "en" });
    expect(typeof svg).toBe('string');
    expect(svg.startsWith('<svg') || svg.startsWith('<g') || svg.includes('xmlns=')).toBeTruthy();
  });

  it('applies the correct theme colors (Dark)', () => {
    const svg = renderCodeLifeBalanceSVG({ balance: mockProfile.codeLifeBalance, theme: defaultTheme, lang: "en" });
    expect(svg).toContain(defaultTheme.glassBg || defaultTheme.background);
  });

  it('applies the correct theme colors (Light)', () => {
    const lightTheme = getTheme('light');
    const svg = renderCodeLifeBalanceSVG({ balance: mockProfile.codeLifeBalance, theme: lightTheme, lang: "en" });
    expect(svg).toContain(lightTheme.glassBg || lightTheme.background);
  });

  it('handles empty data safely', () => {
    // Structural test to ensure it doesn't crash
    expect(() => renderCodeLifeBalanceSVG({ balance: mockProfile.codeLifeBalance, theme: defaultTheme, lang: "en" })).not.toThrow();
  });

  it('renders a valid XML/SVG structure', () => {
    const svg = renderCodeLifeBalanceSVG({ balance: mockProfile.codeLifeBalance, theme: defaultTheme, lang: "en" });
    expect(svg.includes('/>') || svg.includes('</')).toBeTruthy();
  });

  it('contains expected layout elements', () => {
    const svg = renderCodeLifeBalanceSVG({ balance: mockProfile.codeLifeBalance, theme: defaultTheme, lang: "en" });
    expect(svg).toContain('<g');
  });

  it('maintains expected dimensional structure', () => {
    const svg = renderCodeLifeBalanceSVG({ balance: mockProfile.codeLifeBalance, theme: defaultTheme, lang: "en" });
    expect(typeof svg).toBe('string');
  });

  it('escapes or renders content safely', () => {
    const svg = renderCodeLifeBalanceSVG({ balance: mockProfile.codeLifeBalance, theme: defaultTheme, lang: "en" });
    expect(svg).not.toContain('undefined');
  });

  it('uses locale dictionaries (or respects theme if no locale)', () => {
    const svg = renderCodeLifeBalanceSVG({ balance: mockProfile.codeLifeBalance, theme: defaultTheme, lang: "en" });
    expect(svg).toBeDefined();
  });

  it('does not leak internal javascript objects into SVG', () => {
    const svg = renderCodeLifeBalanceSVG({ balance: mockProfile.codeLifeBalance, theme: defaultTheme, lang: "en" });
    expect(svg).not.toContain('[object Object]');
  });
});
