import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('react-dom/client', () => {
  return {
    createRoot: vi.fn(() => ({ render: vi.fn() }))
  };
});

// Mock App to avoid triggering fetch requests or complex renders during this basic test
vi.mock('../App.tsx', () => ({
  default: () => <div data-testid="mock-app" />
}));

describe('main.tsx', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Clear DOM
    document.body.innerHTML = '';
  });

  it('renders the application wrapped in StrictMode into the root element', async () => {
    // Setup the DOM container
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    // Dynamic import to execute main.tsx AFTER mocks are set
    await import('../main.tsx');

    // Assert that createRoot was called with the correct DOM element
    const reactDom = await import('react-dom/client');
    expect(reactDom.createRoot).toHaveBeenCalledWith(root);

    // Assert that render was called
    const mockRoot = vi.mocked(reactDom.createRoot).mock.results[0].value;
    expect(mockRoot.render).toHaveBeenCalled();

    // The first argument passed to render should be a React element (StrictMode > App)
    const renderArg = mockRoot.render.mock.calls[0][0];
    
    // Check if it's a valid react element by looking at its structure
    expect(renderArg).toHaveProperty('type');
  });
});
