import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Mock profile data
const mockProfile = {
  name: 'Test User',
  username: 'testuser',
  bio: 'Test bio',
  location: 'Test location',
  followers: 10,
  createdAt: '2020-01-01',
  stats: {
    commits: 100,
    prs: 10,
    issues: 5,
    stars: 50
  },
  topLanguages: [],
  projects: [],
  contributions: [],
  achievements: [],
  timeOfDay: { morning: 1, afternoon: 1, night: 1 },
  activityStream: [],
  techRadar: { frontend: 1, backend: 1, devops: 1 },
  codeLifeBalance: { weekdays: 5, weekends: 2 },
  milestones: [],
  hourlyFrequency: new Array(24).fill(0)
};

describe('App', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    (globalThis.fetch as any).mockImplementation(() => new Promise(() => {}));
    
    render(<App />);
    expect(screen.getByText('Extrayendo tu ADN técnico...')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    // Mock Date.now to force timeout on the very first retry check
    const originalDateNow = Date.now;
    let calls = 0;
    globalThis.Date.now = vi.fn(() => {
      calls++;
      if (calls === 1) return 1000; // start time
      return 40000; // triggers maxWaitMs (30000)
    });

    (globalThis.fetch as any).mockImplementation(() => Promise.reject(new Error('Network error')));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Servidor inalcanzable (Timeout de 30s)')).toBeInTheDocument();
    });

    globalThis.Date.now = originalDateNow;
  });

  it('renders dashboard with profile data on success', async () => {
    (globalThis.fetch as any).mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProfile)
    }));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('GitData')).toBeInTheDocument();
      expect(screen.getByText('Profile Card Widget')).toBeInTheDocument();
    });
  });
});
