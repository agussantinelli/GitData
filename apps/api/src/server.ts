import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { GithubService } from './services/github.service';

// Load environment variables
dotenv.config();

const server = Fastify({
  logger: true
});

server.register(cors, {
  origin: '*' // Update this in production
});

// Initialize the GithubService
const githubService = new GithubService();

server.get('/', async (request, reply) => {
  return { hello: 'world', message: 'GitData Fastify API is running!' };
});

server.get('/api/profile', async (request: any, reply) => {
  const username = request.query.username;
  
  if (!username) {
    return reply.status(400).send({ error: 'The "username" query parameter is required.' });
  }

  try {
    const profileData = await githubService.getProfileAndRepos(username);
    return profileData;
  } catch (error: any) {
    server.log.error(error);
    return reply.status(500).send({ error: 'Failed to fetch data from GitHub', details: error.message });
  }
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
