import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import githubPlugin from './plugins/github';

// Import modular routes
import rootRoutes from './routes/root';
import profileRoutes from './routes/profile';

// Load environment variables
dotenv.config();

const server = Fastify({
  logger: true
});

server.register(cors, {
  origin: '*' // Update this in production
});

// Register plugins
server.register(githubPlugin);

// Register routes
server.register(rootRoutes);
server.register(profileRoutes, { prefix: '/api/profile' });

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening at http://localhost:3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
