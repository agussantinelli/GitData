import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlobalStatsWidget } from '../GlobalStatsWidget';

const mockStats = {
  commits: 5000,
  prs: 200,
  issues: 100,
  stars: 1000
};

describe('GlobalStatsWidget', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<GlobalStatsWidget stats={mockStats} followers={50} />);
    
    // Check title
    expect(screen.getByText('Estadísticas Globales')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied (default is dark)
    expect(container.firstChild).toHaveClass('theme-dark');

    // Check stats rendering (numbers format might use Intl.NumberFormat, but '5000' usually renders as '5,000' or '5.000' in es)
    // To be safe we test the labels
    expect(screen.getByText('Commits')).toBeInTheDocument();
    expect(screen.getByText('PRs')).toBeInTheDocument();
    expect(screen.getByText('Seguidores')).toBeInTheDocument();
    expect(screen.getByText('Estrellas')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<GlobalStatsWidget stats={mockStats} followers={50} lang="en" />);
    // Stats title in English
    expect(screen.getByText('Global Stats')).toBeInTheDocument();
    expect(screen.getByText('Stars')).toBeInTheDocument();
  });
});
