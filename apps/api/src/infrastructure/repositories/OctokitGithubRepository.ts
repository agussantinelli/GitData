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
    const { Octokit } = await import('octokit');
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
          pullRequests {
            totalCount
          }
          issues {
            totalCount
          }
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            restrictedContributionsCount
            contributionCalendar {
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
          repositories(first: 50, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
            nodes {
              name
              description
              url
              stargazerCount
              forkCount
              homepageUrl
              diskUsage
              isArchived
              isPrivate
              isFork
              createdAt
              updatedAt
              licenseInfo {
                name
              }
              watchers {
                totalCount
              }
              issues(states: OPEN) {
                totalCount
              }
              pullRequests(states: OPEN) {
                totalCount
              }
              defaultBranchRef {
                target {
                  ... on Commit {
                    history {
                      totalCount
                    }
                  }
                }
              }
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

      const projects: Project[] = repos
        .filter((repo: any) => !repo.isFork)
        .map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazerCount,
        forks: repo.forkCount,
        url: repo.url,
        homepageUrl: repo.homepageUrl || null,
        primaryLanguage: repo.primaryLanguage?.name || null,
        sizeKb: repo.diskUsage || 0,
        isArchived: repo.isArchived || false,
        isPrivate: repo.isPrivate || false,
        isFork: repo.isFork || false,
        createdAt: repo.createdAt,
        updatedAt: repo.updatedAt,
        openIssues: repo.issues?.totalCount || 0,
        openPullRequests: repo.pullRequests?.totalCount || 0,
        license: repo.licenseInfo?.name || null,
        watchers: repo.watchers?.totalCount || 0,
        collaborators: repo.collaborators?.totalCount || 0,
        totalCommits: repo.defaultBranchRef?.target?.history?.totalCount || 0
      }));

      repos.forEach((repo: any) => {
        totalStars += repo.stargazerCount;
        
        // Excluir forks para no sumar lenguajes de repositorios ajenos enormes
        if (!repo.isFork && repo.languages && repo.languages.edges) {
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

      const totalBytes = Object.values(languageMap).reduce((acc, bytes) => acc + bytes, 0);

      const topLanguages = Object.keys(languageMap)
        .sort((a, b) => languageMap[b] - languageMap[a])
        .slice(0, 5)
        .map(lang => ({
          name: lang,
          percentage: totalBytes > 0 ? Math.round((languageMap[lang] / totalBytes) * 100) : 0
        }));

      const contributions: { date: string; count: number }[] = [];
      let weekdays = 0;
      let weekends = 0;

      if (user.contributionsCollection?.contributionCalendar?.weeks) {
        user.contributionsCollection.contributionCalendar.weeks.forEach((week: any) => {
          week.contributionDays.forEach((day: any) => {
            contributions.push({
              date: day.date,
              count: day.contributionCount,
            });
            
            const dayOfWeek = new Date(day.date).getUTCDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
              weekends += day.contributionCount;
            } else {
              weekdays += day.contributionCount;
            }
          });
        });
      }
      
      const codeLifeBalance = { weekdays, weekends };

      // --- LIVE ACTIVITY STREAM & TIME OF DAY (REST API) ---
      let publicEvents: any[] = [];
      try {
        const eventsRes = await octokit.request('GET /users/{username}/events/public', {
          username: username,
          per_page: 50
        });
        publicEvents = eventsRes.data;
      } catch (e) {
        console.warn('Could not fetch REST events', e);
      }

      const activityStream = publicEvents.slice(0, 10).map((ev: any) => ({
        id: ev.id,
        type: ev.type,
        repo: ev.repo?.name || 'Unknown',
        date: ev.created_at,
        description: ev.type.replace('Event', '')
      }));

      let morning = 0, afternoon = 0, night = 0;
      const hourlyFrequency = new Array(24).fill(0);

      publicEvents.forEach((ev: any) => {
        const hour = new Date(ev.created_at).getHours();
        hourlyFrequency[hour]++;

        if (hour >= 6 && hour < 12) morning++;
        else if (hour >= 12 && hour < 20) afternoon++;
        else night++;
      });
      const timeOfDay = { morning, afternoon, night };

      // --- TECH RADAR (CATEGORIZED) ---
      let frontend = 0, backend = 0, devops = 0;
      const feLangs = ['HTML', 'CSS', 'SCSS', 'JavaScript', 'TypeScript', 'Vue', 'React', 'Svelte'];
      const beLangs = ['Java', 'C#', 'Python', 'PHP', 'Ruby', 'Go', 'Rust', 'C++', 'C'];
      Object.keys(languageMap).forEach(lang => {
        if (feLangs.includes(lang)) frontend += languageMap[lang];
        else if (beLangs.includes(lang)) backend += languageMap[lang];
        else devops += languageMap[lang];
      });
      const techRadar = { frontend, backend, devops };

      // --- ACHIEVEMENTS INFERENCE ---
      const achievements = [];
      const prs = user.pullRequests?.totalCount || 0;
      const issues = user.issues?.totalCount || 0;
      const followers = user.followers?.totalCount || 0;

      if (prs >= 5) achievements.push({ id: 'pull-shark', title: 'Pull Shark', description: 'Has contributed multiple PRs.', icon: 'pull-shark' });
      if (issues >= 5) achievements.push({ id: 'bug-hunter', title: 'Bug Hunter', description: 'Reported many issues.', icon: 'bug-hunter' });
      if (followers >= 10) achievements.push({ id: 'influencer', title: 'Influencer', description: 'Has a solid follower base.', icon: 'influencer' });
      if (night > morning && night > afternoon) achievements.push({ id: 'night-owl', title: 'Night Owl', description: 'Codes mostly at night.', icon: 'night-owl' });
      else if (morning > afternoon && morning > night) achievements.push({ id: 'early-bird', title: 'Early Bird', description: 'Codes in the morning.', icon: 'early-bird' });

      // --- MILESTONES ---
      const milestones = [];
      milestones.push({ id: 'account-created', date: user.createdAt, title: 'Account Created', description: 'Joined the GitHub community.', meta: {} });
      
      if (projects.length > 0) {
        // Find the oldest repository
        const oldestProject = [...projects].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
        milestones.push({ 
          id: 'first-repo',
          date: oldestProject.createdAt, 
          title: 'First Public Repo', 
          description: `Created ${oldestProject.name}.`,
          meta: { repo: oldestProject.name }
        });

        // First Fork (Contribution Attempt)
        const forks = projects.filter(p => p.isFork);
        if (forks.length > 0) {
          const firstFork = forks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
          milestones.push({
            id: 'first-fork',
            date: firstFork.createdAt,
            title: 'First Fork',
            description: `Forked ${firstFork.name} to experiment or contribute.`,
            meta: { repo: firstFork.name }
          });
        }

        // Most Popular Project
        const starred = projects.filter(p => p.stars > 0);
        if (starred.length > 0) {
          const mostStarred = starred.sort((a, b) => b.stars - a.stars)[0];
          milestones.push({
            id: 'community-recognition',
            date: mostStarred.createdAt,
            title: 'Community Recognition',
            description: `${mostStarred.name} reached ${mostStarred.stars} stars.`,
            meta: { repo: mostStarred.name, stars: mostStarred.stars }
          });
        }

        // Largest Codebase
        const largest = [...projects].sort((a, b) => b.sizeKb - a.sizeKb)[0];
        if (largest && largest.sizeKb > 1000) { 
          milestones.push({
            id: 'major-codebase',
            date: largest.createdAt,
            title: 'Major Codebase',
            description: `Started ${largest.name} (${Math.round(largest.sizeKb / 1024)}MB).`,
            meta: { repo: largest.name, size: Math.round(largest.sizeKb / 1024) }
          });
        }
      }
      
      // Sort milestones chronologically
      milestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
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
          commits: (user.contributionsCollection?.totalCommitContributions || 0) + (user.contributionsCollection?.restrictedContributionsCount || 0),
          prs,
          issues,
          stars: totalStars,
        },
        topLanguages,
        projects,
        contributions,
        achievements,
        timeOfDay,
        activityStream,
        techRadar,
        codeLifeBalance,
        milestones,
        hourlyFrequency,
      };
    } catch (error: any) {
      console.error('Error fetching data from GitHub:', error);
      throw error;
    }
  }
}
