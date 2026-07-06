import { FastifyPluginAsync } from 'fastify';

const profileRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (request: any, reply) => {
    const username = request.query.username;
    
    if (!username) {
      return reply.status(400).send({ error: 'The "username" query parameter is required.' });
    }

    try {
      // Access GithubService via the fastify instance
      const profileData = await fastify.github.getProfileAndRepos(username);
      return profileData;
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch data from GitHub', details: error.message });
    }
  });
};

export default profileRoutes;
