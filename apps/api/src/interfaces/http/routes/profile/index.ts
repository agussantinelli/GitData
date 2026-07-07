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

const cache = new TTLCache<unknown>(5 * 60 * 1000); // 5 minutes TTL

const profileRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (request: any, reply) => {
    const parsed = usernameSchema.safeParse(request.query);

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Invalid request',
        details: parsed.error.issues.map(i => i.message).join(', ')
      });
    }

    const { username } = parsed.data;
    const clientIp = request.ip;

    const cached = cache.get(username);
    if (cached) {
      fastify.log.info({ username, ip: clientIp, cacheHit: true }, 'Profile request served from cache');
      return cached;
    }

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);
      cache.set(username, profileData);
      fastify.log.info({ username, ip: clientIp, cacheHit: false, cacheSize: cache.size() }, 'Profile request served from GitHub API');
      return profileData;
    } catch (error: any) {
      fastify.log.error({ err: error, username }, 'GitHub data fetch failed');
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
};

export default profileRoutes;
