import { describe, it, expect } from 'vitest';
import { 
  ProfileStats, 
  Project, 
  LanguageStat, 
  ContributionDay, 
  Achievement, 
  TimeOfDay, 
  ActivityEvent, 
  TechRadar, 
  CodeLifeBalance, 
  Milestone, 
  DeveloperProfile 
} from '../Profile';

describe('Profile Entity Interfaces', () => {
  it('should support creating a valid ProfileStats object', () => {
    const stats: ProfileStats = { commits: 10, prs: 5, issues: 2, stars: 100 };
    expect(stats.commits).toBe(10);
    expect(stats.stars).toBe(100);
  });

  it('should support creating a valid Project object', () => {
    const project: Project = {
      name: 'repo',
      description: 'desc',
      stars: 1,
      forks: 1,
      url: 'http',
      homepageUrl: null,
      primaryLanguage: 'TS',
      sizeKb: 10,
      isArchived: false,
      isPrivate: false,
      isFork: false,
      createdAt: '2023',
      updatedAt: '2023',
      openIssues: 0,
      openPullRequests: 0,
      license: null,
      watchers: 1,
      collaborators: 1,
      totalCommits: 10
    };
    expect(project.name).toBe('repo');
    expect(project.isPrivate).toBe(false);
  });

  it('should support creating a valid LanguageStat object', () => {
    const lang: LanguageStat = { name: 'TS', percentage: 50 };
    expect(lang.name).toBe('TS');
    expect(lang.percentage).toBe(50);
  });

  it('should support creating a valid ContributionDay object', () => {
    const day: ContributionDay = { date: '2023-01-01', count: 5 };
    expect(day.date).toBe('2023-01-01');
    expect(day.count).toBe(5);
  });

  it('should support creating a valid Achievement object', () => {
    const achievement: Achievement = { id: '1', title: 'A', description: 'B', icon: 'C' };
    expect(achievement.id).toBe('1');
  });

  it('should support creating a valid TimeOfDay object', () => {
    const time: TimeOfDay = { morning: 1, afternoon: 2, night: 3 };
    expect(time.night).toBe(3);
  });

  it('should support creating a valid ActivityEvent object', () => {
    const event: ActivityEvent = { id: '1', type: 'Push', repo: 'A', date: '2023', description: 'B' };
    expect(event.type).toBe('Push');
  });

  it('should support creating a valid TechRadar object', () => {
    const radar: TechRadar = { frontend: 10, backend: 20, devops: 5 };
    expect(radar.backend).toBe(20);
  });

  it('should support creating a valid CodeLifeBalance object', () => {
    const balance: CodeLifeBalance = { weekdays: 10, weekends: 2 };
    expect(balance.weekends).toBe(2);
  });

  it('should support creating a valid Milestone object', () => {
    const milestone: Milestone = { id: '1', date: '2023', title: 'A', description: 'B' };
    expect(milestone.title).toBe('A');
  });

  it('should support creating a full DeveloperProfile object', () => {
    const profile: DeveloperProfile = {
      username: 'user',
      name: 'User Name',
      bio: null,
      company: null,
      location: null,
      websiteUrl: null,
      twitterUsername: null,
      createdAt: '2023',
      followers: 10,
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
    expect(profile.username).toBe('user');
    expect(profile.stats.commits).toBe(10);
    expect(profile.hourlyFrequency.length).toBe(24);
  });
});
