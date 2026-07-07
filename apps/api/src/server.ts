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
// App Plugins & Routes
// ──────────────────────────────────────────
server.register(githubPlugin);
server.register(rootRoutes);
server.register(profileRoutes, { prefix: '/api/profile' });

const start = async () => {
  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
