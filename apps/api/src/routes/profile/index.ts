import { FastifyPluginAsync } from 'fastify';
import { GithubService } from '../../services/github.service';

const profileRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Initialize the GithubService
  const githubService = new GithubService();

  fastify.get('/', async (request: any, reply) => {
    const username = request.query.username;
    
    if (!username) {
      return reply.status(400).send({ error: 'The "username" query parameter is required.' });
    }

    try {
      const profileData = await githubService.getProfileAndRepos(username);
      return profileData;
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch data from GitHub', details: error.message });
    }
  });
};

export default profileRoutes;
