export interface ProfileStats {
  commits: number;
  prs: number;
  stars: number;
}

export interface Project {
  name: string;
  description: string | null;
  stars: number;
  url: string;
}

export interface DeveloperProfile {
  username: string;
  name: string | null;
  bio: string | null;
  followers: number;
  stats: ProfileStats;
  topLanguages: string[];
  projects: Project[];
}
