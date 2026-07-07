import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import profileRoutes from '../index';

describe('Profile Routes', () => {
  let fastify: any;
  const mockExecute = vi.fn();

  beforeAll(async () => {
    fastify = Fastify({ logger: false });
    
    // Mock the use cases plugin injection
    fastify.decorate('useCases', {
      getDeveloperProfile: {
        execute: mockExecute
      }
    });

    await fastify.register(profileRoutes, { prefix: '/api/profile' });
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('returns 400 if username is missing', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/profile'
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload).error).toBe('Invalid request');
  });

  it('returns 400 if username is too long', async () => {
    const longName = 'a'.repeat(40);
    const response = await fastify.inject({
      method: 'GET',
      url: `/api/profile?username=${longName}`
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload).details).toContain('at most 39');
  });

  it('returns 400 if username contains invalid characters', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/profile?username=invalid_user!'
    });

    expect(response.statusCode).toBe(400);
  });

  it('calls useCase and returns profile if valid', async () => {
    mockExecute.mockResolvedValueOnce({ username: 'validuser', stats: { stars: 10 } });

    const response = await fastify.inject({
      method: 'GET',
      url: '/api/profile?username=validuser'
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.username).toBe('validuser');
    expect(mockExecute).toHaveBeenCalledWith('validuser');
  });

  it('returns cached data if requested twice', async () => {
    // First request already populated the cache in the previous test
    mockExecute.mockClear();

    const response = await fastify.inject({
      method: 'GET',
      url: '/api/profile?username=validuser'
    });

    expect(response.statusCode).toBe(200);
    // Should NOT have called execute again due to cache
    expect(mockExecute).not.toHaveBeenCalled();
    const body = JSON.parse(response.payload);
    expect(body.username).toBe('validuser');
  });

  it('returns 500 if useCase throws an error', async () => {
    mockExecute.mockRejectedValueOnce(new Error('GitHub API Error'));

    const response = await fastify.inject({
      method: 'GET',
      url: '/api/profile?username=failuser'
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload).error).toBe('Internal server error');
  });
});
