import fp from 'fastify-plugin';
import { GithubService } from '../services/github.service';

declare module 'fastify' {
  interface FastifyInstance {
    github: GithubService;
  }
}

export default fp(async (fastify, opts) => {
  const githubService = new GithubService();
  fastify.decorate('github', githubService);
});
