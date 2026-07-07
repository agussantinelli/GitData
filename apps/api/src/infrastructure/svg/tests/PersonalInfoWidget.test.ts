import { describe, it, expect } from 'vitest';
import { renderPersonalInfoSVG } from '../PersonalInfoWidget';
import { getTheme } from '../themes';
import { dictionaries } from '../locales';

describe('PersonalInfoWidget SVG', () => {
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
    hourlyFrequency: []
  };
  const defaultTheme = getTheme('dark');

  it('renders successfully without throwing', () => {
    const svg = renderPersonalInfoSVG({ data: mockProfile, theme: defaultTheme, lang: 'en', avatarBase64: 'https://github.com/testuser.png' });
    expect(typeof svg).toBe('string');
    expect(svg.includes('<svg')).toBeTruthy();
  });

  it('includes the correct name and bio', () => {
    const svg = renderPersonalInfoSVG({ data: mockProfile, theme: defaultTheme, lang: 'en', avatarBase64: 'https://github.com/testuser.png' });
    expect(svg).toContain('Test User');
    expect(svg).toContain('Software Engineer');
  });

  it('includes location if present', () => {
    const svg = renderPersonalInfoSVG({ data: mockProfile, theme: defaultTheme, lang: 'en', avatarBase64: 'https://github.com/testuser.png' });
    expect(svg).toContain('Earth');
  });

  it('handles null company safely', () => {
    const p = { ...mockProfile, company: null };
    const svg = renderPersonalInfoSVG({ data: p, theme: defaultTheme, lang: 'en', avatarBase64: 'https://github.com/testuser.png' });
    expect(svg).toBeTruthy(); // Just ensuring it doesn't throw
  });

  it('handles null location safely', () => {
    const p = { ...mockProfile, location: null };
    const svg = renderPersonalInfoSVG({ data: p, theme: defaultTheme, lang: 'en', avatarBase64: 'https://github.com/testuser.png' });
    expect(svg).not.toContain('Earth');
  });

  it('handles null bio safely', () => {
    const p = { ...mockProfile, bio: null };
    const svg = renderPersonalInfoSVG({ data: p, theme: defaultTheme, lang: 'en', avatarBase64: 'https://github.com/testuser.png' });
    expect(svg).not.toContain('Software Engineer');
  });

  it('applies the correct theme colors (Dark)', () => {
    const svg = renderPersonalInfoSVG({ data: mockProfile, theme: defaultTheme, lang: 'en', avatarBase64: 'https://github.com/testuser.png' });
    expect(svg).toContain(defaultTheme.glassBg);
  });

  it('applies the correct theme colors (Light)', () => {
    const lightTheme = getTheme('light');
    const svg = renderPersonalInfoSVG({ data: mockProfile, theme: lightTheme, lang: 'en', avatarBase64: 'https://github.com/testuser.png' });
    expect(svg).toContain(lightTheme.glassBg);
  });

  it('renders avatar URL based on username', () => {
    const svg = renderPersonalInfoSVG({ data: mockProfile, theme: defaultTheme, lang: 'en', avatarBase64: 'https://github.com/testuser.png' });
    expect(svg).toContain('https://github.com/testuser.png');
  });

  it('has consistent SVG wrapper dimensions', () => {
    const svg = renderPersonalInfoSVG({ data: mockProfile, theme: defaultTheme, lang: 'en', avatarBase64: 'https://github.com/testuser.png' });
    expect(svg).toContain('width="850"');
    expect(svg).toContain('height="328"');
  });
});
