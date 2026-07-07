import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const usernameSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(39, 'Username must be at most 39 characters')
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/, 'Invalid GitHub username format')
});

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

    try {
      const profileData = await fastify.useCases.getDeveloperProfile.execute(username);
      return profileData;
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch data from GitHub', details: error.message });
    }
  });
};

export default profileRoutes;
