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
  it('renders correctly with default props (es/dark)', () => {
    const { container } = render(<MilestonesWidget milestones={mockMilestones} />);
    expect(screen.getByText('Línea de Tiempo')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('theme-dark');
    expect(screen.getByText('First Commit')).toBeInTheDocument();
  });

  it('renders empty state correctly in default lang', () => {
    render(<MilestonesWidget milestones={[]} />);
    expect(screen.getByText('No hay hitos disponibles.')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<MilestonesWidget milestones={mockMilestones} lang="en" />);
    expect(screen.getByText('Timeline')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (pt)', () => {
    render(<MilestonesWidget milestones={mockMilestones} lang="pt" />);
    expect(screen.getByText('Linha do Tempo')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (fr)', () => {
    render(<MilestonesWidget milestones={mockMilestones} lang="fr" />);
    expect(screen.getByText('Chronologie')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (it)', () => {
    render(<MilestonesWidget milestones={mockMilestones} lang="it" />);
    expect(screen.getByText('Cronologia')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<MilestonesWidget milestones={mockMilestones} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('handles missing descriptions gracefully', () => {
    const missingDesc = [{ id: '3', date: '2023-01-01', title: 'No Desc', description: null as any }];
    render(<MilestonesWidget milestones={missingDesc} />);
    expect(screen.getByText('No Desc')).toBeInTheDocument();
  });

  it('handles invalid date strings gracefully', () => {
    const badDate = [{ id: '4', date: 'not-a-date', title: 'Title', description: 'Desc' }];
    render(<MilestonesWidget milestones={badDate} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('renders very large number of milestones', () => {
    const largeList = new Array(20).fill(0).map((_, i) => ({
      id: `id-${i}`, date: '2023-01-01', title: `Title ${i}`, description: `Desc ${i}`
    }));
    const { container } = render(<MilestonesWidget milestones={largeList} />);
    expect(container.querySelectorAll('.milestone-item').length).toBe(20);
  });
});
