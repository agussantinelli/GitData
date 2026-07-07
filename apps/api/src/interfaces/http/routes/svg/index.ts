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
import { renderCodeFrequencySVG } from '../../../../infrastructure/svg/CodeFrequencyWidget';
import { renderMilestonesSVG } from '../../../../infrastructure/svg/MilestonesWidget';
import { renderTechRadarSVG } from '../../../../infrastructure/svg/TechRadarWidget';
import { renderActivityStreamSVG } from '../../../../infrastructure/svg/ActivityStreamWidget';
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

    const { username, theme: themeStr, lang } = query.data;

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `top-languages:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      const svgString = renderTopLanguagesSVG({
        languages: profileData.topLanguages,
        theme: getTheme(themeStr),
        lang: lang as Language
      });

      cache.set(cacheKey, svgString);
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

    const { username, theme: themeStr, lang } = query.data;

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `popular-projects:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      const svgString = renderPopularProjectsSVG({
        projects: profileData.projects,
        theme: getTheme(themeStr),
        lang: lang as Language
      });

      cache.set(cacheKey, svgString);
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

    const { username, theme: themeStr, lang } = query.data;

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `achievements:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      const svgString = renderAchievementsSVG({
        achievements: profileData.achievements,
        theme: getTheme(themeStr),
        lang: lang as Language
      });

      cache.set(cacheKey, svgString);
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

    const { username, theme: themeStr, lang } = query.data;

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `profile:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

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
        theme: getTheme(themeStr),
        lang: lang as Language,
        avatarBase64
      });

      cache.set(cacheKey, svgString);
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating profile SVG');
    }
  });

  fastify.get('/hourly-frequency', async (req: any, reply: any) => {
    const query = widgetQuerySchema.safeParse(req.query);

    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme: themeStr, lang } = query.data;

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `hourly-frequency:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);
      const svgString = renderHourlyFrequencySVG({
        hourlyFrequency: profileData.hourlyFrequency,
        theme: getTheme(themeStr),
        lang: lang as Language
      });

      cache.set(cacheKey, svgString);
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating hourly frequency SVG');
    }
  });

  fastify.get('/time-of-day', async (req: any, reply: any) => {
    const query = widgetQuerySchema.safeParse(req.query);

    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme: themeStr, lang } = query.data;

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `time-of-day:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);
      // Construct timeOfDay based on hourlyFrequency
      const h = profileData.hourlyFrequency;
      const morning = h.slice(6, 12).reduce((a, b) => a + b, 0);
      const afternoon = h.slice(12, 20).reduce((a, b) => a + b, 0);
      const night = [...h.slice(20, 24), ...h.slice(0, 6)].reduce((a, b) => a + b, 0);

      const svgString = renderTimeOfDaySVG({
        timeOfDay: { morning, afternoon, night },
        theme: getTheme(themeStr),
        lang: lang as Language
      });

      cache.set(cacheKey, svgString);
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating time of day SVG');
    }
  });

  fastify.get('/code-life-balance', async (req: any, reply: any) => {
    const query = widgetQuerySchema.safeParse(req.query);

    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme: themeStr, lang } = query.data;

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `code-life-balance:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      const svgString = renderCodeLifeBalanceSVG({
        balance: profileData.codeLifeBalance,
        theme: getTheme(themeStr),
        lang: lang as Language
      });

      cache.set(cacheKey, svgString);
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating code life balance SVG');
    }
  });

  fastify.get('/categorized-projects', async (req: any, reply: any) => {
    const query = widgetQuerySchema.safeParse(req.query);

    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme: themeStr, lang } = query.data;

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `categorized-projects:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      const mappedProjects: Project[] = profileData.projects.map((repo: any) => ({
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

      const svgString = renderCategorizedProjectsSVG({
        projects: mappedProjects,
        theme: getTheme(themeStr),
        lang: lang as Language
      });

      cache.set(cacheKey, svgString);
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating categorized projects SVG');
    }
  });

  fastify.get('/code-frequency', async (req: any, reply: any) => {
    const query = widgetQuerySchema.safeParse(req.query);

    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme: themeStr, lang } = query.data;

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `code-frequency:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      const svgString = renderCodeFrequencySVG({
        contributions: profileData.contributions,
        theme: getTheme(themeStr),
        lang: lang as Language
      });

      cache.set(cacheKey, svgString);
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating code frequency SVG');
    }
  });

  fastify.get('/milestones', async (req: any, reply: any) => {
    const query = widgetQuerySchema.safeParse(req.query);

    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme: themeStr, lang } = query.data;

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `milestones:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      const svgString = renderMilestonesSVG({
        milestones: profileData.milestones,
        theme: getTheme(themeStr),
        lang: lang as Language
      });

      cache.set(cacheKey, svgString);
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating milestones SVG');
    }
  });

  fastify.get('/tech-radar', async (req: any, reply: any) => {
    const query = widgetQuerySchema.safeParse(req.query);

    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme: themeStr, lang } = query.data;

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `tech-radar:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      const svgString = renderTechRadarSVG({
        techRadar: profileData.techRadar,
        theme: getTheme(themeStr),
        lang: lang as Language
      });

      cache.set(cacheKey, svgString);
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating tech radar SVG');
    }
  });

  fastify.get('/activity-stream', async (req: any, reply: any) => {
    const query = widgetQuerySchema.safeParse(req.query);

    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme: themeStr, lang } = query.data;

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800');

    const cacheKey = `activity-stream:${username}:${themeStr}:${lang}`;
    const cachedSvg = cache.get(cacheKey);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);

      const svgString = renderActivityStreamSVG({
        activityStream: profileData.activityStream,
        theme: getTheme(themeStr),
        lang: lang as Language
      });

      cache.set(cacheKey, svgString);
      return reply.send(svgString);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send('Error generating activity stream SVG');
    }
  });
};

export default svgRoutes;
