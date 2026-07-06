import { FastifyPluginAsync } from 'fastify';

const rootRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world', message: 'GitData Fastify API is running! (Clean Architecture)' };
  });
};

export default rootRoutes;
