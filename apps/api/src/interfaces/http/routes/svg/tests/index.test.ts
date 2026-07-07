import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import svgRoutes from '../index';

describe('SVG Routes', () => {
  let fastify: any;
  const mockExecute = vi.fn();

  const mockProfile = {
    username: 'testuser',
    name: 'Test User',
    stats: { commits: 10, prs: 5, issues: 2, stars: 100 },
    followers: 100,
    topLanguages: [],
    projects: [],
    contributions: [],
    achievements: [],
    timeOfDay: { morning: 1, afternoon: 2, night: 3 },
    activityStream: [],
    techRadar: { frontend: 10, backend: 20, devops: 5 },
    codeLifeBalance: { weekdays: 10, weekends: 2 },
    milestones: [],
    hourlyFrequency: Array(24).fill(0)
  };

  beforeAll(async () => {
    fastify = Fastify({ logger: false });
    
    fastify.decorate('useCases', {
      getDeveloperProfile: {
        execute: mockExecute
      }
    });

    await fastify.register(svgRoutes, { prefix: '/api/svg' });
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  const endpoints = [
    '/global-stats',
    '/top-languages',
    '/popular-projects',
    '/achievements',
    '/profile',
    '/hourly-frequency',
    '/time-of-day',
    '/code-life-balance',
    '/categorized-projects',
    '/code-frequency',
    '/milestones',
    '/tech-radar',
    '/activity-stream'
  ];

  describe('Validation & Errors', () => {
    it('returns 400 if username is missing', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/api/svg/global-stats'
      });

      expect(response.statusCode).toBe(400);
    });

    it('returns 500 and fallback SVG if GitHub API fails on global-stats', async () => {
      mockExecute.mockRejectedValueOnce(new Error('GitHub API Error'));

      const response = await fastify.inject({
        method: 'GET',
        url: '/api/svg/global-stats?username=failuser'
      });

      expect(response.statusCode).toBe(500);
      expect(response.payload).toContain('<svg');
      expect(response.payload).toContain('Error loading widget');
    });

    it('returns 500 text for other routes if GitHub API fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('GitHub API Error'));

      const response = await fastify.inject({
        method: 'GET',
        url: '/api/svg/top-languages?username=failuser'
      });

      expect(response.statusCode).toBe(500);
      expect(response.payload).toContain('Error');
    });
  });

  describe('Success & SVG rendering', () => {
    beforeAll(() => {
      mockExecute.mockResolvedValue(mockProfile);
    });

    // We can run a dynamic test for each endpoint
    endpoints.forEach(endpoint => {
      it(`returns 200 and valid SVG for ${endpoint}`, async () => {
        // Clear cache by using a unique username or just assume it works
        const uniqueUser = `user-${endpoint.replace('/', '')}`;
        const response = await fastify.inject({
          method: 'GET',
          url: `/api/svg${endpoint}?username=${uniqueUser}`
        });

        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toBe('image/svg+xml');
        expect(response.payload.startsWith('<svg') || response.payload.includes('<g')).toBeTruthy();
      });

      it(`returns 200 and caches the SVG for ${endpoint}`, async () => {
        const uniqueUser = `cacheuser-${endpoint.replace('/', '')}`;
        
        // Request 1
        await fastify.inject({ method: 'GET', url: `/api/svg${endpoint}?username=${uniqueUser}` });
        
        // Reset mock
        mockExecute.mockClear();

        // Request 2
        const response = await fastify.inject({ method: 'GET', url: `/api/svg${endpoint}?username=${uniqueUser}` });
        
        expect(response.statusCode).toBe(200);
        expect(mockExecute).not.toHaveBeenCalled(); // Served from cache
      });

      it(`respects lang and theme query params for ${endpoint}`, async () => {
        const uniqueUser = `paramuser-${endpoint.replace('/', '')}`;
        const response = await fastify.inject({
          method: 'GET',
          url: `/api/svg${endpoint}?username=${uniqueUser}&lang=en&theme=light`
        });

        expect(response.statusCode).toBe(200);
      });
    });
  });
});
