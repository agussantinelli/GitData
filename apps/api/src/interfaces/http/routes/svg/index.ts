import { type FastifyPluginAsync, type FastifyRequest, type FastifyReply } from 'fastify';
import { z } from 'zod';
import { TTLCache } from '../../../../infrastructure/cache/TTLCache';
import { getTheme } from '../../../../infrastructure/svg/themes';
import { renderGlobalStatsSVG } from '../../../../infrastructure/svg/GlobalStatsWidget';
import { renderTopLanguagesSVG } from '../../../../infrastructure/svg/TopLanguagesWidget';
import { renderPopularProjectsSVG, type Project } from '../../../../infrastructure/svg/PopularProjectsWidget';
import { renderAchievementsSVG, type Achievement } from '../../../../infrastructure/svg/AchievementsWidget';
import { renderPersonalInfoSVG } from '../../../../infrastructure/svg/PersonalInfoWidget';
import { renderHourlyFrequencySVG } from '../../../../infrastructure/svg/HourlyFrequencyWidget';
import { renderTimeOfDaySVG } from '../../../../infrastructure/svg/TimeOfDayWidget';
import { renderCodeLifeBalanceSVG } from '../../../../infrastructure/svg/CodeLifeBalanceWidget';
import { renderCategorizedProjectsSVG } from '../../../../infrastructure/svg/CategorizedProjectsWidget';
import type { Language } from '../../../../infrastructure/svg/locales';

const widgetQuerySchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(39, 'Username must be at most 39 characters')
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/, 'Invalid GitHub username format'),
  theme: z.enum(['light', 'dark']).optional().default('dark'),
  lang: z.enum(['es', 'en', 'pt', 'it', 'fr']).optional().default('es')
});

const cache = new TTLCache<string>(5 * 60 * 1000); // 5 minutes TTL for SVGs

const svgRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/global-stats', async (request: any, reply) => {
    const parsed = widgetQuerySchema.safeParse(request.query);

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Invalid request',
        details: parsed.error.issues.map(i => i.message).join(', ')
      });
    }

    const { username, theme: themeStr, lang } = parsed.data;
    
    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `global-stats:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);
      
      const theme = getTheme(themeStr);
      const svgContent = renderGlobalStatsSVG({
        stats: profileData.stats,
        followers: profileData.followers,
        theme,
        lang: lang as Language
      });

      cache.set(cacheKey, svgContent);
      return reply.send(svgContent);
    } catch (error: any) {
      fastify.log.error({ err: error, username }, 'GitHub data fetch failed (SVG Route)');
      const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="384" height="250"><rect width="100%" height="100%" fill="#1a1a1a"/><text x="20" y="125" fill="red" font-family="sans-serif">Error loading widget</text></svg>`;
      return reply.status(500).send(errorSvg);
    }
  });

  fastify.get('/top-languages', async (req: any, reply) => {
    const query = widgetQuerySchema.safeParse(req.query);
    
    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme = 'dark', lang = 'es' } = query.data;

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      const svgString = renderTopLanguagesSVG({
        languages: profileData.topLanguages,
        theme: getTheme(theme),
        lang: lang as Language
      });

      reply.header('Content-Type', 'image/svg+xml');
      reply.header('Cache-Control', 'public, max-age=3600'); 
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating top languages SVG');
    }
  });

  fastify.get('/popular-projects', async (req: any, reply) => {
    const query = widgetQuerySchema.safeParse(req.query);
    
    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme = 'dark', lang = 'es' } = query.data;

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      const svgString = renderPopularProjectsSVG({
        projects: profileData.projects,
        theme: getTheme(theme),
        lang: lang as Language
      });

      reply.header('Content-Type', 'image/svg+xml');
      reply.header('Cache-Control', 'public, max-age=3600'); 
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating popular projects SVG');
    }
  });

  fastify.get('/achievements', async (req: any, reply) => {
    const query = widgetQuerySchema.safeParse(req.query);
    
    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme = 'dark', lang = 'es' } = query.data;

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      const svgString = renderAchievementsSVG({
        achievements: profileData.achievements,
        theme: getTheme(theme),
        lang: lang as Language
      });

      reply.header('Content-Type', 'image/svg+xml');
      reply.header('Cache-Control', 'public, max-age=3600'); 
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating achievements SVG');
    }
  });

  fastify.get('/profile', async (req: any, reply) => {
    const query = widgetQuerySchema.safeParse(req.query);
    
    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme = 'dark', lang = 'es' } = query.data;

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      // Fetch avatar and convert to base64 to avoid CORS/SVG issues
      let avatarBase64 = '';
      try {
        const avatarRes = await fetch(`https://github.com/${profileData.username}.png`);
        if (avatarRes.ok) {
          const arrayBuffer = await avatarRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          avatarBase64 = `data:image/png;base64,${buffer.toString('base64')}`;
        }
      } catch (err) {
        fastify.log.warn('Could not fetch avatar for ' + profileData.username);
      }

      const svgString = renderPersonalInfoSVG({
        data: profileData,
        theme: getTheme(theme),
        lang: lang as Language,
        avatarBase64
      });

      reply.header('Content-Type', 'image/svg+xml');
      reply.header('Cache-Control', 'public, max-age=3600'); 
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating profile SVG');
    }
  });

  // ------------------------------------------
  // PHASE 2 WIDGETS
  // ------------------------------------------

  fastify.get('/hourly-frequency', async (req: FastifyRequest, reply: FastifyReply) => {
    const { username, theme = 'dark', lang = 'es' } = req.query as { username: string, theme?: string, lang?: string };
    if (!username) return reply.status(400).send('Username is required');

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);
      const svgString = renderHourlyFrequencySVG({
        hourlyFrequency: profileData.hourlyFrequency || Array(24).fill(0),
        theme: getTheme(theme),
        lang: lang as Language
      });

      reply.header('Content-Type', 'image/svg+xml');
      reply.header('Cache-Control', 'public, max-age=3600'); 
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating hourly frequency SVG');
    }
  });

  fastify.get('/time-of-day', async (req: FastifyRequest, reply: FastifyReply) => {
    const { username, theme = 'dark', lang = 'es' } = req.query as { username: string, theme?: string, lang?: string };
    if (!username) return reply.status(400).send('Username is required');

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);
      // Construct timeOfDay based on hourlyFrequency
      const h = profileData.hourlyFrequency || Array(24).fill(0);
      const morning = h.slice(6, 12).reduce((a, b) => a + b, 0);
      const afternoon = h.slice(12, 20).reduce((a, b) => a + b, 0);
      const night = [...h.slice(20, 24), ...h.slice(0, 6)].reduce((a, b) => a + b, 0);

      const svgString = renderTimeOfDaySVG({
        timeOfDay: { morning, afternoon, night },
        theme: getTheme(theme),
        lang: lang as Language
      });

      reply.header('Content-Type', 'image/svg+xml');
      reply.header('Cache-Control', 'public, max-age=3600'); 
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating time of day SVG');
    }
  });

  fastify.get('/code-life-balance', async (req: FastifyRequest, reply: FastifyReply) => {
    const { username, theme = 'dark', lang = 'es' } = req.query as { username: string, theme?: string, lang?: string };
    if (!username) return reply.status(400).send('Username is required');

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);
      
      const svgString = renderCodeLifeBalanceSVG({
        balance: { weekdays: Math.round(profileData.stats.commits * 0.8), weekends: Math.round(profileData.stats.commits * 0.2) }, // We approximate this from real totalCommits as example
        theme: getTheme(theme),
        lang: lang as Language
      });

      reply.header('Content-Type', 'image/svg+xml');
      reply.header('Cache-Control', 'public, max-age=3600'); 
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating code life balance SVG');
    }
  });

  fastify.get('/categorized-projects', async (req: FastifyRequest, reply: FastifyReply) => {
    const { username, theme = 'dark', lang = 'es' } = req.query as { username: string, theme?: string, lang?: string };
    if (!username) return reply.status(400).send('Username is required');

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);
      
      const mappedProjects: Project[] = profileData.projects.map(repo => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stars,
        forks: repo.forks,
        url: repo.url,
        primaryLanguage: repo.primaryLanguage,
        sizeKb: repo.sizeKb,
        updatedAt: repo.updatedAt,
        totalCommits: repo.totalCommits
      }));

      // Adjusting fake totalCommits for the categorization demo so it's consistent if 0
      mappedProjects.forEach(p => { if (!p.totalCommits) p.totalCommits = p.forks * 15 + p.stars * 5; });

      const svgString = renderCategorizedProjectsSVG({
        projects: mappedProjects,
        theme: getTheme(theme),
        lang: lang as Language
      });

      reply.header('Content-Type', 'image/svg+xml');
      reply.header('Cache-Control', 'public, max-age=3600'); 
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating categorized projects SVG');
    }
  });
};

export default svgRoutes;
