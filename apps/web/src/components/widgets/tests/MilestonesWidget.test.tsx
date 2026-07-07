import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MilestonesWidget } from '../MilestonesWidget';

const mockMilestones = [
  {
    id: '1',
    date: '2023-01-01',
    title: 'First Commit',
    description: 'The journey begins'
  },
  {
    id: '2',
    date: '2023-12-31',
    title: 'Reached 1k followers',
    description: 'A great year'
  }
];

describe('MilestonesWidget', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<MilestonesWidget milestones={mockMilestones} />);
    
    // Check title
    expect(screen.getByText('Línea de Tiempo')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied
    expect(container.firstChild).toHaveClass('theme-dark');

    // Check content
    expect(screen.getByText('First Commit')).toBeInTheDocument();
    expect(screen.getByText('Reached 1k followers')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    render(<MilestonesWidget milestones={[]} />);
    expect(screen.getByText('No hay hitos disponibles.')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<MilestonesWidget milestones={mockMilestones} lang="en" />);
    // English title
    expect(screen.getByText('Timeline')).toBeInTheDocument();
  });
});
