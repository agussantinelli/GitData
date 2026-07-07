import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MarkdownSnippet } from '../MarkdownSnippet';
import React from 'react';

// Mock clipboard API
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('MarkdownSnippet', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockWriteText.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('1. renders the correct markdown string based on props', () => {
    render(<MarkdownSnippet endpoint="profile" username="testuser" theme="dark" lang="es" />);
    const codeElement = screen.getByText(/!\[GitData Widget\]\(https:\/\/gitdata.tu-dominio.com\/api\/svg\/profile\?username=testuser&theme=dark&lang=es\)/);
    expect(codeElement).toBeInTheDocument();
  });

  it('2. respects the altText prop when provided', () => {
    render(<MarkdownSnippet endpoint="achievements" username="test" theme="light" lang="en" altText="My Achievements" />);
    const codeElement = screen.getByText(/!\[My Achievements\]/);
    expect(codeElement).toBeInTheDocument();
  });

  it('3. updates the button text to "¡Copiado!" when clicked', () => {
    render(<MarkdownSnippet endpoint="profile" username="testuser" theme="dark" lang="es" />);
    const button = screen.getByRole('button', { name: 'Copiar MD' });
    fireEvent.click(button);
    expect(button).toHaveTextContent('¡Copiado!');
  });

  it('4. reverts button text after 2 seconds', () => {
    render(<MarkdownSnippet endpoint="profile" username="testuser" theme="dark" lang="es" />);
    const button = screen.getByRole('button', { name: 'Copiar MD' });
    fireEvent.click(button);
    expect(button).toHaveTextContent('¡Copiado!');
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(button).toHaveTextContent('Copiar MD');
  });

  it('5. calls navigator.clipboard.writeText with the exact markdown string', () => {
    render(<MarkdownSnippet endpoint="tech-radar" username="dev" theme="dark" lang="pt" altText="Radar" />);
    const button = screen.getByRole('button', { name: 'Copiar MD' });
    fireEvent.click(button);
    
    expect(mockWriteText).toHaveBeenCalledTimes(1);
    expect(mockWriteText).toHaveBeenCalledWith('![Radar](https://gitdata.tu-dominio.com/api/svg/tech-radar?username=dev&theme=dark&lang=pt)');
  });

  it('6. applies the correct CSS classes initially', () => {
    const { container } = render(<MarkdownSnippet endpoint="stats" username="u" theme="dark" lang="es" />);
    expect(container.querySelector('.markdown-snippet-container')).toBeInTheDocument();
    expect(container.querySelector('.markdown-code')).toBeInTheDocument();
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('copy-button');
    expect(button).not.toHaveClass('copied');
  });

  it('7. applies the "copied" CSS class upon clicking', () => {
    render(<MarkdownSnippet endpoint="stats" username="u" theme="dark" lang="es" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveClass('copied');
  });

  it('8. handles edge case where language is en and theme is light', () => {
    render(<MarkdownSnippet endpoint="time-of-day" username="alice" theme="light" lang="en" />);
    expect(screen.getByText(/theme=light&lang=en/)).toBeInTheDocument();
  });

  it('9. handles empty username gracefully in URL construction', () => {
    render(<MarkdownSnippet endpoint="stats" username="" theme="dark" lang="es" />);
    expect(screen.getByText(/username=&theme=dark/)).toBeInTheDocument();
  });

  it('10. uses VITE_API_URL when available (simulated default)', () => {
    // VITE_API_URL is mocked as undefined in most test envs, using default 'https://gitdata.tu-dominio.com'
    render(<MarkdownSnippet endpoint="stats" username="test" theme="dark" lang="es" />);
    expect(screen.getByText(/https:\/\/gitdata.tu-dominio.com/)).toBeInTheDocument();
  });
});
