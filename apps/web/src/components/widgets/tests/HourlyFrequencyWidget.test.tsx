import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HourlyFrequencyWidget } from '../HourlyFrequencyWidget';

const mockHourly = Array.from({ length: 24 }, (_, i) => (i === 10 ? 5 : 0));

describe('HourlyFrequencyWidget', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<HourlyFrequencyWidget hourlyFrequency={mockHourly} />);
    
    // Check title
    expect(screen.getByText('Actividad por Hora (24h)')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied (default is dark)
    expect(container.firstChild).toHaveClass('theme-dark');
  });

  it('uses the correct language dictionary (en)', () => {
    render(<HourlyFrequencyWidget hourlyFrequency={mockHourly} lang="en" />);
    // English title
    expect(screen.getByText('Hourly Activity (24h)')).toBeInTheDocument();
  });
});
