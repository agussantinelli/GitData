import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import rootRoutes from '../root';

describe('Root Routes', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    await fastify.register(rootRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should return 200 OK on GET /', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/'
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty('hello', 'world');
    expect(body).toHaveProperty('message');
    expect(body.message).toContain('GitData Fastify API is running');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/not-found'
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 404 for unsupported methods on /', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/'
    });

    expect(response.statusCode).toBe(404); // Fastify returns 404 for unimplemented methods by default if no catch-all
  });
});
