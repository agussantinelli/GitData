import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingOverlay } from '../LoadingOverlay';

describe('LoadingOverlay', () => {
  it('renders default loading message', () => {
    render(<LoadingOverlay />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  it('renders custom loading message', () => {
    render(<LoadingOverlay message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    const { container } = render(<LoadingOverlay error="Network timeout" />);
    
    expect(screen.getByText('Error: Network timeout')).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
    
    // Should not render spinner when in error state
    expect(container.querySelector('.spinner')).not.toBeInTheDocument();
  });

  it('renders very long custom message correctly', () => {
    const longMessage = 'A'.repeat(500);
    render(<LoadingOverlay message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('renders very long error message correctly', () => {
    const longError = 'B'.repeat(500);
    render(<LoadingOverlay error={longError} />);
    expect(screen.getByText(`Error: ${longError}`)).toBeInTheDocument();
  });

  it('prioritizes error state over message state', () => {
    const { container } = render(<LoadingOverlay message="Loading..." error="Failed!" />);
    expect(screen.getByText('Error: Failed!')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(container.querySelector('.spinner')).not.toBeInTheDocument();
  });

  it('handles empty message string gracefully', () => {
    render(<LoadingOverlay message="" />);
    // The spinner should still be there, and message wrapper is empty
    expect(document.querySelector('.spinner')).toBeInTheDocument();
    const msgElement = document.querySelector('.loading-message');
    expect(msgElement).toBeInTheDocument();
    expect(msgElement?.textContent).toBe('');
  });

  it('handles empty error string as falsy and renders loading instead', () => {
    render(<LoadingOverlay error="" />);
    // Since error is an empty string, it is falsy, so it renders the loading spinner
    expect(document.querySelector('.spinner')).toBeInTheDocument();
    expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
  });

  it('contains the correct base container class', () => {
    const { container } = render(<LoadingOverlay />);
    expect(container.firstChild).toHaveClass('loading-overlay');
  });

  it('contains the correct inner wrapper classes for loading state', () => {
    const { container } = render(<LoadingOverlay />);
    expect(container.querySelector('.loading-inner')).toBeInTheDocument();
    expect(container.querySelector('.loading-error-inner')).not.toBeInTheDocument();
  });
});
