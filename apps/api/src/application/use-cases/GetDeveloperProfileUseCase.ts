import { IGithubRepository } from '../../domain/repositories/IGithubRepository';
import { DeveloperProfile } from '../../domain/entities/Profile';

export class GetDeveloperProfileUseCase {
  constructor(private readonly githubRepository: IGithubRepository) {}

  /**
   * Executes the use case to retrieve a developer profile.
   * Business logic can be added here (e.g. validating the username format, 
   * calculating specific ADN metrics beyond what the repo returns).
   * 
   * @param username The GitHub username
   */
  async execute(username: string): Promise<DeveloperProfile> {
    if (!username || username.trim() === '') {
      throw new Error('Username cannot be empty');
    }

    // Call the infrastructure repository
    const profile = await this.githubRepository.getProfileAndRepos(username);
    
    // Future business rules: calculate "ADN Técnico" score based on profile.topLanguages, etc.
    
    return profile;
  }
}
