import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { URLSnippet } from '../URLSnippet';
import React from 'react';

// Mock clipboard API
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('URLSnippet', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockWriteText.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('1. renders the correct URL string based on props', () => {
    render(<URLSnippet endpoint="profile" username="testuser" theme="dark" lang="es" />);
    const codeElement = screen.getByText('https://gitdata.tu-dominio.com/api/svg/profile?username=<tu-nombre-usuario>&theme=dark&lang=es');
    expect(codeElement).toBeInTheDocument();
  });

  it('3. updates the button text to "¡Copiado!" when clicked', () => {
    render(<URLSnippet endpoint="profile" username="testuser" theme="dark" lang="es" />);
    const button = screen.getByRole('button', { name: 'Copiar URL' });
    fireEvent.click(button);
    expect(button).toHaveTextContent('¡Copiado!');
  });

  it('4. reverts button text after 2 seconds', () => {
    render(<URLSnippet endpoint="profile" username="testuser" theme="dark" lang="es" />);
    const button = screen.getByRole('button', { name: 'Copiar URL' });
    fireEvent.click(button);
    expect(button).toHaveTextContent('¡Copiado!');
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(button).toHaveTextContent('Copiar URL');
  });

  it('5. calls navigator.clipboard.writeText with the exact URL string', () => {
    render(<URLSnippet endpoint="tech-radar" username="dev" theme="dark" lang="pt" />);
    const button = screen.getByRole('button', { name: 'Copiar URL' });
    fireEvent.click(button);
    
    expect(mockWriteText).toHaveBeenCalledTimes(1);
    expect(mockWriteText).toHaveBeenCalledWith('https://gitdata.tu-dominio.com/api/svg/tech-radar?username=<tu-nombre-usuario>&theme=dark&lang=pt');
  });

  it('6. applies the correct CSS classes initially', () => {
    const { container } = render(<URLSnippet endpoint="stats" username="u" theme="dark" lang="es" />);
    expect(container.querySelector('.url-snippet-container')).toBeInTheDocument();
    expect(container.querySelector('.url-code')).toBeInTheDocument();
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('copy-button');
    expect(button).not.toHaveClass('copied');
  });

  it('7. applies the "copied" CSS class upon clicking', () => {
    render(<URLSnippet endpoint="stats" username="u" theme="dark" lang="es" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveClass('copied');
  });

  it('8. handles edge case where language is en and theme is light', () => {
    render(<URLSnippet endpoint="time-of-day" username="alice" theme="light" lang="en" />);
    expect(screen.getByText(/theme=light&lang=en/)).toBeInTheDocument();
  });

  it('9. handles empty username gracefully in URL construction', () => {
    render(<URLSnippet endpoint="stats" username="" theme="dark" lang="es" />);
    expect(screen.getByText(/username=<tu-nombre-usuario>&theme=dark/)).toBeInTheDocument();
  });

  it('10. uses VITE_API_URL when available (simulated default)', () => {
    // VITE_API_URL is mocked as undefined in most test envs, using default 'https://gitdata.tu-dominio.com'
    render(<URLSnippet endpoint="stats" username="test" theme="dark" lang="es" />);
    expect(screen.getByText(/https:\/\/gitdata.tu-dominio.com/)).toBeInTheDocument();
  });
});
