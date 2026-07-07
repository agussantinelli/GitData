import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetDeveloperProfileUseCase } from '../GetDeveloperProfileUseCase';
import { IGithubRepository } from '../../../domain/repositories/IGithubRepository';
import { DeveloperProfile } from '../../../domain/entities/Profile';

describe('GetDeveloperProfileUseCase', () => {
  let mockGithubRepository: IGithubRepository;
  let useCase: GetDeveloperProfileUseCase;

  const mockProfile: DeveloperProfile = {
    username: 'testuser',
    name: 'Test User',
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

  beforeEach(() => {
    mockGithubRepository = {
      getProfileAndRepos: vi.fn().mockResolvedValue(mockProfile)
    };
    useCase = new GetDeveloperProfileUseCase(mockGithubRepository);
  });

  it('should successfully return a profile for a valid username', async () => {
    const result = await useCase.execute('testuser');
    expect(result).toEqual(mockProfile);
    expect(mockGithubRepository.getProfileAndRepos).toHaveBeenCalledWith('testuser');
    expect(mockGithubRepository.getProfileAndRepos).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if username is empty string', async () => {
    await expect(useCase.execute('')).rejects.toThrow('Username cannot be empty');
    expect(mockGithubRepository.getProfileAndRepos).not.toHaveBeenCalled();
  });

  it('should throw an error if username contains only spaces', async () => {
    await expect(useCase.execute('   ')).rejects.toThrow('Username cannot be empty');
    expect(mockGithubRepository.getProfileAndRepos).not.toHaveBeenCalled();
  });

  it('should handle trailing and leading spaces properly if logic changes, currently it just trims for validation', async () => {
    // Current logic throws if trim() === '', but it passes '  valid  ' to repo
    // Assuming we want to verify it doesn't throw for padded valid strings
    const result = await useCase.execute('  validuser  ');
    expect(result).toEqual(mockProfile);
    expect(mockGithubRepository.getProfileAndRepos).toHaveBeenCalledWith('  validuser  ');
  });

  it('should propagate errors thrown by the repository', async () => {
    const error = new Error('Repository error');
    mockGithubRepository.getProfileAndRepos = vi.fn().mockRejectedValue(error);
    
    await expect(useCase.execute('testuser')).rejects.toThrow('Repository error');
  });

  it('should execute cleanly in a different instance without shared state', async () => {
    const useCase2 = new GetDeveloperProfileUseCase(mockGithubRepository);
    const result = await useCase2.execute('user2');
    expect(result.username).toBe('testuser'); // mocked return
    expect(mockGithubRepository.getProfileAndRepos).toHaveBeenCalledWith('user2');
  });

  it('should handle undefined gracefully (type override)', async () => {
    // @ts-ignore testing invalid input
    await expect(useCase.execute(undefined)).rejects.toThrow('Username cannot be empty');
  });

  it('should handle null gracefully (type override)', async () => {
    // @ts-ignore testing invalid input
    await expect(useCase.execute(null)).rejects.toThrow('Username cannot be empty');
  });

  it('should return exactly the same reference if repository caches it', async () => {
    const result1 = await useCase.execute('testuser');
    const result2 = await useCase.execute('testuser');
    expect(result1).toBe(result2); // Because mockResolvedValue returns the exact same object reference
  });

  it('has a constructor that initializes properly', () => {
    expect(useCase).toBeInstanceOf(GetDeveloperProfileUseCase);
  });
});
