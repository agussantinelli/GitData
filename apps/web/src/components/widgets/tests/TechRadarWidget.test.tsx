import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TechRadarWidget } from '../TechRadarWidget';

const mockRadar = {
  frontend: 80,
  backend: 60,
  devops: 40
};

describe('TechRadarWidget', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<TechRadarWidget techRadar={mockRadar} />);
    
    // Check title
    expect(screen.getByText('Radar Tecnológico')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied
    expect(container.firstChild).toHaveClass('theme-dark');
  });

  it('uses the correct language dictionary (en)', () => {
    render(<TechRadarWidget techRadar={mockRadar} lang="en" />);
    // English title
    expect(screen.getByText('Tech Radar')).toBeInTheDocument();
  });
});
