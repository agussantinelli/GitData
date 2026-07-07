import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeFrequencyWidget } from '../CodeFrequencyWidget';

const mockContributions = [
  { date: '2023-01-01', count: 5 },
  { date: '2023-01-02', count: 0 },
  { date: '2023-01-03', count: 12 },
];

describe('CodeFrequencyWidget', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<CodeFrequencyWidget contributions={mockContributions} />);
    
    // Check main elements
    expect(screen.getByText('Frecuencia de Código')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied (default is dark)
    expect(container.firstChild).toHaveClass('theme-dark');
  });

  it('renders empty state correctly', () => {
    render(<CodeFrequencyWidget contributions={[]} />);
    // Translation for no data in default 'es' lang
    expect(screen.getByText('No hay datos de frecuencia disponibles.')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<CodeFrequencyWidget contributions={mockContributions} lang="en" />);
    // Title in English
    expect(screen.getByText('Code Frequency')).toBeInTheDocument();
  });
});
