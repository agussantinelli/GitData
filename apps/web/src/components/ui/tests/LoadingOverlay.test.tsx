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
});
