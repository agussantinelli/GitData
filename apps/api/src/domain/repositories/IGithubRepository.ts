import { DeveloperProfile } from '../entities/Profile';

export interface IGithubRepository {
  /**
   * Fetches the complete developer profile data from GitHub.
   * @param username The GitHub username
   */
  getProfileAndRepos(username: string): Promise<DeveloperProfile>;
}
