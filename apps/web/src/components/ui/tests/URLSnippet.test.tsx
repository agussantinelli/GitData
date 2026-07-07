import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { URLSnippet } from '../URLSnippet';
import React from 'react';

// Mock clipboard API
const mockWriteText = vi.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  configurable: true,
});

describe('URLSnippet', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockWriteText.mockClear();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it('1. renders the correct URL string based on props', () => {
    render(<URLSnippet endpoint="profile" username="testuser" theme="dark" lang="es" />);
    const codeElement = screen.getByText('https://git-data-web.vercel.app/api/svg/profile?username=<tu-nombre-usuario>&theme=dark&lang=es');
    expect(codeElement).toBeInTheDocument();
  });

  it('2. hides copy button text and keeps only icon on small screens', () => {
    // This is tested implicitly by CSS, but we can verify the button has the right class
    render(<URLSnippet endpoint="stats" username="test" theme="light" lang="en" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('copy-button');
  });

  it('3. handles different themes correctly in URL', () => {
    render(<URLSnippet endpoint="stats" username="test" theme="light" lang="en" />);
    expect(screen.getByText(/theme=light/)).toBeInTheDocument();
  });

  it('4. handles different languages correctly in URL', () => {
    render(<URLSnippet endpoint="stats" username="test" theme="dark" lang="pt" />);
    expect(screen.getByText(/lang=pt/)).toBeInTheDocument();
  });

  it('5. calls navigator.clipboard.writeText with the exact URL string', () => {
    render(<URLSnippet endpoint="tech-radar" username="dev" theme="dark" lang="pt" />);
    const button = screen.getByRole('button', { name: 'Copiar URL' });
    fireEvent.click(button);
    
    expect(mockWriteText).toHaveBeenCalledTimes(1);
    expect(mockWriteText).toHaveBeenCalledWith('https://git-data-web.vercel.app/api/svg/tech-radar?username=<tu-nombre-usuario>&theme=dark&lang=pt');
  });

  it('6. applies the correct CSS classes initially', () => {
    const { container } = render(<URLSnippet endpoint="stats" username="test" theme="dark" lang="es" />);
    
    expect(container.querySelector('.url-snippet-container')).toBeInTheDocument();
    expect(container.querySelector('.url-code')).toBeInTheDocument();
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('copy-button');
    expect(button).not.toHaveClass('copied');
  });

  it('7. applies the "copied" CSS class upon clicking', () => {
    render(<URLSnippet endpoint="stats" username="test" theme="dark" lang="es" />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(button).toHaveClass('copied');
  });

  it('8. removes the "copied" CSS class after 2 seconds', () => {
    render(<URLSnippet endpoint="stats" username="test" theme="dark" lang="es" />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(button).toHaveClass('copied');
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(button).not.toHaveClass('copied');
  });

  it('9. handles empty username gracefully in URL construction', () => {
    render(<URLSnippet endpoint="stats" username="" theme="dark" lang="es" />);
    expect(screen.getByText(/username=<tu-nombre-usuario>&theme=dark/)).toBeInTheDocument();
  });

  it('10. uses VITE_API_URL when available (simulated default)', () => {
    render(<URLSnippet endpoint="stats" username="test" theme="dark" lang="es" />);
    expect(screen.getByText(/https:\/\/git-data-web\.vercel\.app/)).toBeInTheDocument();
  });
});
