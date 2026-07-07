export interface ProfileStats {
  commits: number;
  prs: number;
  issues: number;
  stars: number;
}

export interface Project {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  url: string;
  homepageUrl: string | null;
  primaryLanguage: string | null;
  sizeKb: number;
  isArchived: boolean;
  isPrivate: boolean;
  isFork: boolean;
  createdAt: string;
  updatedAt: string;
  openIssues: number;
  openPullRequests: number;
  license: string | null;
  watchers: number;
  collaborators: number;
  totalCommits: number;
}

export interface LanguageStat {
  name: string;
  percentage: number;
}

export interface ContributionDay {
  date: string;
  count: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TimeOfDay {
  morning: number;
  afternoon: number;
  night: number;
}

export interface ActivityEvent {
  id: string;
  type: string;
  repo: string;
  date: string;
  description: string;
}

export interface TechRadar {
  frontend: number;
  backend: number;
  devops: number;
}

export interface CodeLifeBalance {
  weekdays: number;
  weekends: number;
}

export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  meta?: any;
}

export interface DeveloperProfile {
  username: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  websiteUrl: string | null;
  twitterUsername: string | null;
  createdAt: string;
  followers: number;
  stats: ProfileStats;
  topLanguages: LanguageStat[];
  projects: Project[];
  contributions: ContributionDay[];
  achievements: Achievement[];
  timeOfDay: TimeOfDay;
  activityStream: ActivityEvent[];
  techRadar: TechRadar;
  codeLifeBalance: CodeLifeBalance;
  milestones: Milestone[];
  hourlyFrequency: number[];
}
