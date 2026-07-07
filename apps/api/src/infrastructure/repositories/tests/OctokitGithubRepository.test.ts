import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OctokitGithubRepository } from '../OctokitGithubRepository';

const mockGraphql = vi.fn();
const mockRequest = vi.fn();

vi.mock('octokit', () => {
  return {
    Octokit: vi.fn().mockImplementation(() => ({
      graphql: mockGraphql,
      request: mockRequest
    }))
  };
});

describe('OctokitGithubRepository', () => {
  let repository: OctokitGithubRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new OctokitGithubRepository('fake-token');
    
    // Default valid mock response
    mockGraphql.mockResolvedValue({
      user: {
        name: 'John Doe',
        bio: 'Dev',
        company: null,
        location: 'Earth',
        websiteUrl: 'https://johndoe.com',
        twitterUsername: 'johndoe',
        createdAt: '2020-01-01T00:00:00Z',
        followers: { totalCount: 42 },
        pullRequests: { totalCount: 10 },
        issues: { totalCount: 5 },
        contributionsCollection: {
          totalCommitContributions: 100,
          totalPullRequestContributions: 10,
          totalIssueContributions: 5,
          restrictedContributionsCount: 20,
          contributionCalendar: {
            weeks: [
              {
                contributionDays: [
                  { contributionCount: 5, date: '2023-01-01' },
                  { contributionCount: 2, date: '2023-01-02' }
                ]
              }
            ]
          }
        },
        repositories: {
          nodes: [
            {
              name: 'repo1',
              description: 'First repo',
              url: 'https://github.com/repo1',
              stargazerCount: 50,
              forkCount: 10,
              homepageUrl: null,
              diskUsage: 1024,
              isArchived: false,
              isPrivate: false,
              isFork: false,
              createdAt: '2021-01-01T00:00:00Z',
              updatedAt: '2021-02-01T00:00:00Z',
              licenseInfo: { name: 'MIT' },
              watchers: { totalCount: 5 },
              issues: { totalCount: 1 },
              pullRequests: { totalCount: 0 },
              defaultBranchRef: { target: { history: { totalCount: 20 } } },
              primaryLanguage: { name: 'TypeScript' },
              languages: {
                edges: [
                  { size: 500, node: { name: 'TypeScript' } },
                  { size: 100, node: { name: 'HTML' } }
                ]
              }
            }
          ]
        }
      }
    });

    mockRequest.mockResolvedValue({
      data: [
        { id: '1', type: 'PushEvent', repo: { name: 'repo1' }, created_at: '2023-01-01T10:00:00Z' }
      ]
    });
  });

  it('should instantiate successfully with token', () => {
    expect(repository).toBeInstanceOf(OctokitGithubRepository);
  });

  it('should fallback to process.env.GITHUB_TOKEN if no token is provided', () => {
    process.env.GITHUB_TOKEN = 'env-token';
    const repoEnv = new OctokitGithubRepository();
    expect(repoEnv).toBeInstanceOf(OctokitGithubRepository);
  });

  it('should fetch and map standard user profile successfully', async () => {
    const profile = await repository.getProfileAndRepos('johndoe');
    
    expect(mockGraphql).toHaveBeenCalled();
    expect(profile.name).toBe('John Doe');
    expect(profile.stats.stars).toBe(50);
    expect(profile.projects.length).toBe(1);
  });

  it('should throw an error if the user is not found', async () => {
    mockGraphql.mockResolvedValue({ user: null });
    
    await expect(repository.getProfileAndRepos('notfound')).rejects.toThrow('User not found');
  });

  it('should correctly sum commits from contributionsCollection and restrictedContributions', async () => {
    const profile = await repository.getProfileAndRepos('johndoe');
    expect(profile.stats.commits).toBe(120); // 100 + 20
  });

  it('should correctly filter out forks from projects list and languages', async () => {
    mockGraphql.mockResolvedValueOnce({
      user: {
        ...mockGraphql.mock.results[0]?.value?.user,
        repositories: {
          nodes: [
            { isFork: false, stargazerCount: 10, name: 'original' },
            { isFork: true, stargazerCount: 100, name: 'forked' }
          ]
        }
      }
    });

    const profile = await repository.getProfileAndRepos('johndoe');
    // Fork shouldn't be in projects
    expect(profile.projects.find(p => p.name === 'forked')).toBeUndefined();
    // But forks might still count for stars? Wait, the logic filters forks from language map, but let's check projects:
    // `const projects: Project[] = repos.filter((repo: any) => !repo.isFork)...`
    expect(profile.projects.length).toBe(1);
    expect(profile.projects[0].name).toBe('original');
  });

  it('should calculate topLanguages percentages correctly', async () => {
    const profile = await repository.getProfileAndRepos('johndoe');
    expect(profile.topLanguages.length).toBe(2);
    expect(profile.topLanguages[0].name).toBe('TypeScript');
    expect(profile.topLanguages[0].percentage).toBe(83); // 500 / 600
    expect(profile.topLanguages[1].name).toBe('HTML');
    expect(profile.topLanguages[1].percentage).toBe(17); // 100 / 600
  });

  it('should handle missing repositories data safely', async () => {
    mockGraphql.mockResolvedValueOnce({
      user: { repositories: { nodes: null } }
    });
    const profile = await repository.getProfileAndRepos('johndoe');
    expect(profile.projects).toEqual([]);
    expect(profile.stats.stars).toBe(0);
  });

  it('should map REST API events to activity stream correctly', async () => {
    const profile = await repository.getProfileAndRepos('johndoe');
    expect(mockRequest).toHaveBeenCalledWith('GET /users/{username}/events/public', {
      username: 'johndoe',
      per_page: 50
    });
    expect(profile.activityStream.length).toBe(1);
    expect(profile.activityStream[0].type).toBe('PushEvent');
    expect(profile.activityStream[0].description).toBe('Push'); // 'Event' is stripped
  });

  it('should handle REST API failure gracefully without breaking the graphql response', async () => {
    mockRequest.mockRejectedValueOnce(new Error('Rate limited'));
    
    const profile = await repository.getProfileAndRepos('johndoe');
    expect(profile.name).toBe('John Doe'); // still returns data
    expect(profile.activityStream).toEqual([]); // empty stream
  });

  it('should infer achievements properly based on stats', async () => {
    const profile = await repository.getProfileAndRepos('johndoe');
    // We mocked PRs = 10, Issues = 5, Followers = 42
    // Expected: pull-shark, bug-hunter, influencer
    const ids = profile.achievements.map(a => a.id);
    expect(ids).toContain('pull-shark');
    expect(ids).toContain('bug-hunter');
    expect(ids).toContain('influencer');
  });

  it('should categorize tech radar correctly based on language mappings', async () => {
    const profile = await repository.getProfileAndRepos('johndoe');
    // TypeScript (500) and HTML (100) are frontend
    expect(profile.techRadar.frontend).toBe(600);
    expect(profile.techRadar.backend).toBe(0);
    expect(profile.techRadar.devops).toBe(0);
  });

  it('should create milestones from account creation and project dates', async () => {
    const profile = await repository.getProfileAndRepos('johndoe');
    const milestoneIds = profile.milestones.map(m => m.id);
    expect(milestoneIds).toContain('account-created');
    expect(milestoneIds).toContain('first-repo');
    expect(milestoneIds).toContain('community-recognition');
  });

  it('should calculate code life balance (weekdays/weekends)', async () => {
    const profile = await repository.getProfileAndRepos('johndoe');
    // '2023-01-01' is a Sunday (weekend) -> count 5
    // '2023-01-02' is a Monday (weekday) -> count 2
    expect(profile.codeLifeBalance.weekends).toBe(5);
    expect(profile.codeLifeBalance.weekdays).toBe(2);
  });
});
