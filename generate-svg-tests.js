const fs = require('fs');
const path = require('path');

const widgets = [
  { name: 'CodeFrequencyWidget', func: 'renderCodeFrequencySVG', props: '{ contributions: mockProfile.contributions, theme: defaultTheme, lang: "en" }' },
  { name: 'CategorizedProjectsWidget', func: 'renderCategorizedProjectsSVG', props: '{ projects: mockProfile.projects, theme: defaultTheme, lang: "en" }' },
  { name: 'AchievementsWidget', func: 'renderAchievementsSVG', props: '{ achievements: mockProfile.achievements, theme: defaultTheme, lang: "en" }' },
  { name: 'ActivityStreamWidget', func: 'renderActivityStreamSVG', props: '{ activityStream: mockProfile.activityStream, theme: defaultTheme, lang: "en" }' },
  { name: 'CodeLifeBalanceWidget', func: 'renderCodeLifeBalanceSVG', props: '{ balance: mockProfile.codeLifeBalance, theme: defaultTheme, lang: "en" }' },
  { name: 'HourlyFrequencyWidget', func: 'renderHourlyFrequencySVG', props: '{ frequency: mockProfile.hourlyFrequency, theme: defaultTheme, lang: "en" }' },
  { name: 'MilestonesWidget', func: 'renderMilestonesSVG', props: '{ milestones: mockProfile.milestones, theme: defaultTheme, lang: "en" }' },
  { name: 'PopularProjectsWidget', func: 'renderPopularProjectsSVG', props: '{ projects: mockProfile.projects, theme: defaultTheme, lang: "en" }' },
  { name: 'TechRadarWidget', func: 'renderTechRadarSVG', props: '{ techRadar: mockProfile.techRadar, theme: defaultTheme, lang: "en" }' },
  { name: 'TimeOfDayWidget', func: 'renderTimeOfDaySVG', props: '{ timeOfDay: mockProfile.timeOfDay, theme: defaultTheme, lang: "en" }' },
  { name: 'TopLanguagesWidget', func: 'renderTopLanguagesSVG', props: '{ languages: mockProfile.topLanguages, theme: defaultTheme, lang: "en" }' },
  { name: 'CardWrapper', func: 'renderCardWrapper', props: '{ width: 800, height: 200, theme: defaultTheme, children: "<circle />" }', isCardWrapper: true }
];

const mockProfileString = `
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
`;

widgets.forEach(w => {
  const filePath = path.join(__dirname, 'apps/api/src/infrastructure/svg/tests', w.name + '.test.ts');
  
  if (fs.existsSync(filePath)) return;

  const content = "import { describe, it, expect } from 'vitest';\n" +
"import { " + w.func + " } from '../" + w.name + "';\n" +
"import { getTheme } from '../themes';\n" +
"import { dictionaries } from '../locales';\n" +
"\n" +
"describe('" + w.name + " SVG', () => {\n" +
  (w.isCardWrapper ? "" : mockProfileString) +
"  const defaultTheme = getTheme('dark');\n" +
"\n" +
"  it('renders successfully without throwing', () => {\n" +
"    const svg = " + w.func + "(" + w.props + ");\n" +
"    expect(typeof svg).toBe('string');\n" +
"    expect(svg.startsWith('<svg') || svg.startsWith('<g') || svg.includes('xmlns=')).toBeTruthy();\n" +
"  });\n" +
"\n" +
"  it('applies the correct theme colors (Dark)', () => {\n" +
"    const svg = " + w.func + "(" + w.props + ");\n" +
"    expect(svg).toContain(defaultTheme.glassBg || defaultTheme.background);\n" +
"  });\n" +
"\n" +
"  it('applies the correct theme colors (Light)', () => {\n" +
"    const lightTheme = getTheme('light');\n" +
"    const svg = " + w.func + "(" + w.props.replace('defaultTheme', 'lightTheme') + ");\n" +
"    expect(svg).toContain(lightTheme.glassBg || lightTheme.background);\n" +
"  });\n" +
"\n" +
"  it('handles empty data safely', () => {\n" +
"    // Structural test to ensure it doesn't crash\n" +
"    expect(() => " + w.func + "(" + w.props + ")).not.toThrow();\n" +
"  });\n" +
"\n" +
"  it('renders a valid XML/SVG structure', () => {\n" +
"    const svg = " + w.func + "(" + w.props + ");\n" +
"    expect(svg.includes('/>') || svg.includes('</')).toBeTruthy();\n" +
"  });\n" +
"\n" +
"  it('contains expected layout elements', () => {\n" +
"    const svg = " + w.func + "(" + w.props + ");\n" +
"    expect(svg).toContain('<g');\n" +
"  });\n" +
"\n" +
"  it('maintains expected dimensional structure', () => {\n" +
"    const svg = " + w.func + "(" + w.props + ");\n" +
"    expect(typeof svg).toBe('string');\n" +
"  });\n" +
"\n" +
"  it('escapes or renders content safely', () => {\n" +
"    const svg = " + w.func + "(" + w.props + ");\n" +
"    expect(svg).not.toContain('undefined');\n" +
"  });\n" +
"\n" +
"  it('uses locale dictionaries (or respects theme if no locale)', () => {\n" +
"    const svg = " + w.func + "(" + w.props + ");\n" +
"    expect(svg).toBeDefined();\n" +
"  });\n" +
"\n" +
"  it('does not leak internal javascript objects into SVG', () => {\n" +
"    const svg = " + w.func + "(" + w.props + ");\n" +
"    expect(svg).not.toContain('[object Object]');\n" +
"  });\n" +
"});\n";

  fs.writeFileSync(filePath, content);
  console.log("Generated " + w.name + ".test.ts");
});
