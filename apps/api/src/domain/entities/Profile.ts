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
}
