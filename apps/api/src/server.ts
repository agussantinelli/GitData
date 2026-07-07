import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import dotenv from 'dotenv';

// Import Infrastructure Plugins
import githubPlugin from './infrastructure/fastify-plugins/github.plugin';

// Import Interfaces (Routes)
import rootRoutes from './interfaces/http/routes/root';
import profileRoutes from './interfaces/http/routes/profile';
import svgRoutes from './interfaces/http/routes/svg/index';

// Load environment variables
dotenv.config();

// ──────────────────────────────────────────
// FAIL FAST: Validate required env variables
// ──────────────────────────────────────────
if (!process.env.GITHUB_TOKEN) {
  console.error('[FATAL] GITHUB_TOKEN is not defined in .env — server cannot start.');
  process.exit(1);
}

const PORT = Number(process.env.PORT) || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const server = Fastify({
  logger: true,
  requestTimeout: 15000,
  trustProxy: IS_PRODUCTION
});

// ──────────────────────────────────────────
// Security Middleware
// ──────────────────────────────────────────
server.register(helmet);

server.register(cors, {
  origin: ALLOWED_ORIGIN,
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

// ──────────────────────────────────────────
// Optional API Key (only enforced if API_KEY is set in .env)
// ──────────────────────────────────────────
if (process.env.API_KEY) {
  const VALID_KEY = process.env.API_KEY;
  server.addHook('onRequest', async (request, reply) => {
    const key = request.headers['x-api-key'];
    if (key !== VALID_KEY) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  });
  console.log('[Security] API Key authentication is ENABLED.');
}

// ──────────────────────────────────────────
// App Plugins & Routes
// ──────────────────────────────────────────
server.register(githubPlugin);
server.register(rootRoutes);
server.register(profileRoutes, { prefix: '/api/profile' });
server.register(svgRoutes, { prefix: '/api/svg' });

const start = async () => {
  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
