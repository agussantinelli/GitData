import Fastify from 'fastify';
import cors from '@fastify/cors';

const server = Fastify({
  logger: true
});

server.register(cors, {
  origin: '*' // Update this in production
});

server.get('/', async (request, reply) => {
  return { hello: 'world', message: 'GitData Fastify API is running!' };
});

server.get('/api/profile', async (request, reply) => {
  // Dummy git data for the mini layouts
  return {
    username: "agussantinelli",
    stats: {
      commits: 1543,
      prs: 42,
      stars: 128
    },
    topLanguages: ["TypeScript", "JavaScript", "HTML"],
    projects: [
      { name: "GitData", description: "API Engine for Git stats" },
      { name: "Portfolio", description: "Personal website" }
    ]
  };
});

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
