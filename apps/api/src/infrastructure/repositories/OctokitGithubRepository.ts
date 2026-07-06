import { IGithubRepository } from '../../domain/repositories/IGithubRepository';
import { DeveloperProfile, Project } from '../../domain/entities/Profile';

export class OctokitGithubRepository implements IGithubRepository {
  private token?: string;

  constructor(token?: string) {
    this.token = token || process.env.GITHUB_TOKEN;
    if (!this.token) {
      console.warn('⚠️ GITHUB_TOKEN is not defined. Requests will fail if they require authentication.');
    }
  }

  async getProfileAndRepos(username: string): Promise<DeveloperProfile> {
    const octokitModule = await Function('return import("octokit")')() as typeof import('octokit');
    const Octokit = octokitModule.Octokit;
    const octokit = new Octokit({ auth: this.token });

    const query = `
      query userInfo($login: String!) {
        user(login: $login) {
          name
          bio
          company
          location
          websiteUrl
          twitterUsername
          createdAt
          followers {
            totalCount
          }
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
          }
          repositories(first: 50, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
            nodes {
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage {
                name
              }
              languages(first: 5) {
                edges {
                  size
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response: any = await octokit.graphql(query, { login: username });
      const user = response.user;

      if (!user) {
        throw new Error('User not found');
      }

      const repos = user.repositories.nodes || [];
      
      let totalStars = 0;
      const languageMap: Record<string, number> = {};

      const projects: Project[] = repos.slice(0, 3).map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazerCount,
        forks: repo.forkCount,
        url: repo.url
      }));

      repos.forEach((repo: any) => {
        totalStars += repo.stargazerCount;
        
        if (repo.languages && repo.languages.edges) {
          repo.languages.edges.forEach((edge: any) => {
            const lang = edge.node.name;
            const size = edge.size;
            if (!languageMap[lang]) {
              languageMap[lang] = 0;
            }
            languageMap[lang] += size;
          });
        }
      });

      const topLanguages = Object.keys(languageMap)
        .sort((a, b) => languageMap[b] - languageMap[a])
        .slice(0, 5);

      return {
        username,
        name: user.name,
        bio: user.bio,
        company: user.company,
        location: user.location,
        websiteUrl: user.websiteUrl,
        twitterUsername: user.twitterUsername,
        createdAt: user.createdAt,
        followers: user.followers?.totalCount || 0,
        stats: {
          commits: user.contributionsCollection?.totalCommitContributions || 0,
          prs: user.contributionsCollection?.totalPullRequestContributions || 0,
          issues: user.contributionsCollection?.totalIssueContributions || 0,
          stars: totalStars,
        },
        topLanguages,
        projects,
      };
    } catch (error) {
      console.error('Error fetching data from GitHub:', error);
      throw error;
    }
  }
}
