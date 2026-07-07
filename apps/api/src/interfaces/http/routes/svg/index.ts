import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { TTLCache } from '../../../../infrastructure/cache/TTLCache';
import { getTheme } from '../../../../infrastructure/svg/themes';
import { renderGlobalStatsSVG } from '../../../../infrastructure/svg/GlobalStatsWidget';
import { renderTopLanguagesSVG } from '../../../../infrastructure/svg/TopLanguagesWidget';
import { renderPopularProjectsSVG, type Project } from '../../../../infrastructure/svg/PopularProjectsWidget';
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

  fastify.get('/top-languages', async (req, reply) => {
    const query = widgetQuerySchema.safeParse(req.query);
    
    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme = 'dark', lang = 'es' } = query.data;

    try {
      const mockLanguages = [
        { name: 'TypeScript', percentage: 45.2 },
        { name: 'JavaScript', percentage: 25.8 },
        { name: 'CSS', percentage: 12.4 },
        { name: 'HTML', percentage: 8.5 },
        { name: 'Rust', percentage: 8.1 }
      ];

      const svgString = renderTopLanguagesSVG({
        languages: mockLanguages,
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

  fastify.get('/popular-projects', async (req, reply) => {
    const query = widgetQuerySchema.safeParse(req.query);
    
    if (!query.success) {
      return reply.status(400).send('Invalid query parameters');
    }

    const { username, theme = 'dark', lang = 'es' } = query.data;

    try {
      const mockProjects: Project[] = [
        { name: 'gitdata', description: 'Advanced GitHub statistics generator', stars: 128, forks: 42, url: 'https://github.com/gitdata', primaryLanguage: 'TypeScript', sizeKb: 2048, updatedAt: new Date().toISOString(), totalCommits: 500 },
        { name: 'awesome-repo', description: null, stars: 95, forks: 12, url: 'https://github.com/awesome-repo', primaryLanguage: 'Rust', sizeKb: 1500, updatedAt: new Date().toISOString(), totalCommits: 300 }
      ];

      const svgString = renderPopularProjectsSVG({
        projects: mockProjects,
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
};

export default svgRoutes;
