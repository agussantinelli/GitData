import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimeOfDayWidget } from '../TimeOfDayWidget';

const mockTimeOfDay = {
  morning: 30,
  afternoon: 50,
  night: 20
};

describe('TimeOfDayWidget', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<TimeOfDayWidget timeOfDay={mockTimeOfDay} />);
    
    // Check title
    expect(screen.getByText('Reloj del Dev')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied
    expect(container.firstChild).toHaveClass('theme-dark');
  });

  it('uses the correct language dictionary (en)', () => {
    render(<TimeOfDayWidget timeOfDay={mockTimeOfDay} lang="en" />);
    // English title
    expect(screen.getByText('Dev Clock')).toBeInTheDocument();
  });
});
