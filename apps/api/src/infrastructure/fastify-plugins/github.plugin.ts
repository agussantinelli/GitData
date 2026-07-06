import fp from 'fastify-plugin';
import { OctokitGithubRepository } from '../repositories/OctokitGithubRepository';
import { GetDeveloperProfileUseCase } from '../../application/use-cases/GetDeveloperProfileUseCase';

// Define the shape of our use cases injected into fastify
export interface AppUseCases {
  getDeveloperProfile: GetDeveloperProfileUseCase;
}

declare module 'fastify' {
  interface FastifyInstance {
    useCases: AppUseCases;
  }
}

export default fp(async (fastify, opts) => {
  // 1. Initialize Infrastructure Repositories
  const githubRepository = new OctokitGithubRepository();

  // 2. Initialize Application Use Cases
  const getDeveloperProfileUseCase = new GetDeveloperProfileUseCase(githubRepository);

  // 3. Decorate fastify instance
  fastify.decorate('useCases', {
    getDeveloperProfile: getDeveloperProfileUseCase
  });
});
