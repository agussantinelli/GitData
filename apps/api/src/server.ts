import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';

// Import Infrastructure Plugins
import githubPlugin from './infrastructure/fastify-plugins/github.plugin';

// Import Interfaces (Routes)
import rootRoutes from './interfaces/http/routes/root';
import profileRoutes from './interfaces/http/routes/profile';

// Load environment variables
dotenv.config();

const server = Fastify({
  logger: true
});

server.register(cors, {
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  methods: ['GET']
});

server.register(rateLimit, {
  max: 10,
  timeWindow: '1 minute',
  errorResponseBuilder: (_request, context) => ({
    statusCode: 429,
    error: 'Too Many Requests',
    message: `Rate limit exceeded. Try again in ${context.after}.`
  })
});

// Register Plugins (Injects Use Cases into fastify)
server.register(githubPlugin);

// Register Routes (Controllers)
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
