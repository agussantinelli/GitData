import { describe, it, expect, vi } from 'vitest';

// Mock react-dom/client
vi.mock('react-dom/client', () => {
  return {
    createRoot: vi.fn(() => ({
      render: vi.fn(),
    })),
  };
});

describe('main.tsx', () => {
  it('renders without crashing', async () => {
    // Create a dummy root element so document.getElementById('root') works
    const rootEl = document.createElement('div');
    rootEl.id = 'root';
    document.body.appendChild(rootEl);

    // Import main to execute it
    await import('../main');

    // Just verifying it doesn't throw and mock was invoked
    const { createRoot } = await import('react-dom/client');
    expect(createRoot).toHaveBeenCalledWith(rootEl);
    
    // Cleanup
    document.body.removeChild(rootEl);
  });
});
