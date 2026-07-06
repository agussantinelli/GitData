import { Octokit } from 'octokit';

export interface GithubProfileData {
  username: string;
  name: string | null;
  bio: string | null;
  followers: number;
  stats: {
    commits: number;
    prs: number;
    stars: number;
  };
  topLanguages: string[];
  projects: { name: string; description: string | null; stars: number; url: string }[];
}

export class GithubService {
  private octokit: Octokit;

  constructor(token?: string) {
    const auth = token || process.env.GITHUB_TOKEN;
    if (!auth) {
      console.warn('⚠️ GITHUB_TOKEN is not defined. Requests will fail if they require authentication.');
    }
    
    this.octokit = new Octokit({ auth });
  }

  async getProfileAndRepos(username: string): Promise<GithubProfileData> {
    const query = `
      query userInfo($login: String!) {
        user(login: $login) {
          name
          bio
          followers {
            totalCount
          }
          repositories(first: 50, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
            nodes {
              name
              description
              url
              stargazerCount
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
      const response: any = await this.octokit.graphql(query, { login: username });
      const user = response.user;

      if (!user) {
        throw new Error('User not found');
      }

      const repos = user.repositories.nodes || [];
      
      let totalStars = 0;
      const languageMap: Record<string, number> = {};

      const projects = repos.slice(0, 3).map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazerCount,
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

      // Sort languages by size
      const topLanguages = Object.keys(languageMap)
        .sort((a, b) => languageMap[b] - languageMap[a])
        .slice(0, 5);

      return {
        username,
        name: user.name,
        bio: user.bio,
        followers: user.followers?.totalCount || 0,
        stats: {
          commits: 0, // GraphQL doesn't easily expose total commits across all repos in a single simple query without complex timeline traversal, setting to 0 for now.
          prs: 0,
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
