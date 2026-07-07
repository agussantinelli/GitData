import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { TTLCache } from '../../../../infrastructure/cache/TTLCache';

const usernameSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(39, 'Username must be at most 39 characters')
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/, 'Invalid GitHub username format')
});

const cache = new TTLCache<string>(5 * 60 * 1000); // 5 minutes TTL for SVGs

function renderProfileSVG(profileData: any): string {
  // SVG Template that mimics the Glassmorphism card
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1e24" />
          <stop offset="100%" stop-color="#0a0a0a" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="16" fill="url(#bg)" stroke="#ffffff" stroke-opacity="0.1" />
      <g transform="translate(20, 20)">
        <text x="0" y="20" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">
          ${profileData.name || profileData.username}
        </text>
        <text x="0" y="45" font-family="Arial, sans-serif" font-size="12" fill="#a0a0a0" width="360">
          ${profileData.bio || 'Desarrollador en GitHub'}
        </text>
        <text x="0" y="80" font-family="Arial, sans-serif" font-size="14" fill="#ffffff">
          Total Commits (Ultimo año): ${profileData.activity?.totalCommits || 0}
        </text>
        <text x="0" y="105" font-family="Arial, sans-serif" font-size="14" fill="#ffffff">
          Repositorios: ${profileData.projects?.length || 0}
        </text>
      </g>
    </svg>
  `;
}

const svgRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/profile', async (request: any, reply) => {
    const parsed = usernameSchema.safeParse(request.query);

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Invalid request',
        details: parsed.error.issues.map(i => i.message).join(', ')
      });
    }

    const { username } = parsed.data;
    
    // Set response type as SVG
    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'public, max-age=1800'); // Cache in browser for 30 min

    const cachedSvg = cache.get(username);
    if (cachedSvg) {
      return reply.send(cachedSvg);
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);
      const svgContent = renderProfileSVG(profileData);
      cache.set(username, svgContent);
      return reply.send(svgContent);
    } catch (error: any) {
      fastify.log.error({ err: error, username }, 'GitHub data fetch failed (SVG Route)');
      // Return a basic error SVG
      const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="100%" height="100%" fill="#1a1a1a"/><text x="20" y="100" fill="red">Error loading profile</text></svg>`;
      return reply.status(500).send(errorSvg);
    }
  });
};

export default svgRoutes;
