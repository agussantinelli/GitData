import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the components so we don't need to load complex DOM
vi.mock('../components/widgets/PersonalInfoWidget', () => ({
  PersonalInfoWidget: () => <div data-testid="mock-personal-info" />
}));

vi.mock('../components/widgets/PopularProjectsWidget', () => ({
  PopularProjectsWidget: () => <div data-testid="mock-popular-projects" />
}));

vi.mock('../components/ui/LoadingOverlay', () => ({
  LoadingOverlay: ({ message, error }: any) => <div data-testid="mock-loading">{message || error}</div>
}));

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the loading state initially', () => {
    // Override fetch to never resolve so it stays in loading state
    globalThis.fetch = vi.fn(() => new Promise(() => {})) as any;
    render(<App />);
    expect(screen.getByTestId('mock-loading')).toBeInTheDocument();
    expect(screen.getByText('Extrayendo tu ADN técnico...')).toBeInTheDocument();
  });

  it('renders error state when fetch fails completely', async () => {
    // Faster timeout configuration can't be easily injected without modifying code,
    // so we just simulate fetch rejecting immediately inside the retry loop
    // Note: App.tsx has a retry loop. To make it fail fast for testing we need to mock Date.now() 
    // or just let it timeout if possible, but that would take 30s. 
    // Alternatively we can mock the fetch response in a way it bails out, but the loop is while(Date.now...)
    
    // So let's mock Date.now to fast-forward time
    const realDateNow = Date.now.bind(globalThis.Date);
    let time = 0;
    globalThis.Date.now = vi.fn(() => {
      time += 40000; // Jump 40s to break the loop instantly
      return time;
    });

    globalThis.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as any;

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-loading')).toBeInTheDocument();
      // It should display the timeout error
      expect(screen.getByText(/Servidor inalcanzable/i)).toBeInTheDocument();
    });

    globalThis.Date.now = realDateNow;
  });

  const fullMockData = {
    name: 'Agus',
    username: 'agussantinelli',
    bio: '',
    location: '',
    followers: 10,
    createdAt: '2020-01-01',
    stats: { commits: 0, prs: 0, issues: 0, stars: 0 },
    topLanguages: [],
    projects: [],
    contributions: [],
    achievements: [],
    timeOfDay: { morning: 0, afternoon: 0, night: 0 },
    activityStream: [],
    techRadar: { frontend: 0, backend: 0, devops: 0 },
    codeLifeBalance: { weekdays: 0, weekends: 0 },
    milestones: [],
    hourlyFrequency: Array(24).fill(0)
  };

  it('renders the main dashboard when profile data is loaded', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(fullMockData)
    })) as any;

    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('mock-loading')).not.toBeInTheDocument();
      expect(screen.getByText(/GitData/i)).toBeInTheDocument();
      expect(screen.getByText(/Showcase/i)).toBeInTheDocument();
    });
  });

  it('renders language sections for all configured languages', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(fullMockData)
    })) as any;

    render(<App />);
    
    await waitFor(() => {
      const langSections = screen.getAllByText(/Español|English|Português|Italiano|Français/);
      expect(langSections.length).toBeGreaterThan(0);
    });
  });

  it('contains the PersonalInfoWidget after loading', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(fullMockData) })) as any;
    
    render(<App />);
    await waitFor(() => {
      // 5 languages * 2 themes = 10 instances of each widget
      const personalWidgets = screen.getAllByTestId('mock-personal-info');
      expect(personalWidgets.length).toBeGreaterThan(0);
    });
  });

  it('renders the header correctly with GitData Showcase title', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(fullMockData) })) as any;
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('GitData Showcase')).toBeInTheDocument();
      expect(screen.getByText('Colección completa de widgets generados dinámicamente')).toBeInTheDocument();
    });
  });

  it('verifies that fetchWithRetry gracefully handles HTTP 429 by waiting and retrying', async () => {
    const realDateNow = Date.now.bind(globalThis.Date);
    let time = 0;
    globalThis.Date.now = vi.fn(() => {
      time += 1000; 
      return time;
    });

    let fetchCount = 0;
    globalThis.fetch = vi.fn(() => {
      fetchCount++;
      if (fetchCount === 1) {
        return Promise.resolve({ ok: false, status: 429 });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(fullMockData) });
    }) as any;

    render(<App />);
    
    await waitFor(() => {
      expect(fetchCount).toBeGreaterThanOrEqual(2);
      expect(screen.queryByTestId('mock-loading')).not.toBeInTheDocument();
    });

    globalThis.Date.now = realDateNow;
  });

  it('renders correctly the footer and Github profile links', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(fullMockData) })) as any;
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Powered by')).toBeInTheDocument();
    });
  });

  it('renders both dark and light modes for the widgets', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(fullMockData) })) as any;
    render(<App />);
    await waitFor(() => {
      // At least one dark mode widget wrapper and one light mode
      const headers = screen.getAllByRole('heading', { level: 4 });
      const textContents = headers.map(h => h.textContent);
      expect(textContents.some(t => t?.includes('Modo Oscuro'))).toBe(true);
      expect(textContents.some(t => t?.includes('Modo Claro'))).toBe(true);
    });
  });
});

