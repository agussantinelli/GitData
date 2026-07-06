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
  topLanguages: string[];
  projects: Project[];
}
