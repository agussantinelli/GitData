import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityStreamWidget } from '../ActivityStreamWidget';

const mockActivityStream = [
  {
    id: '1',
    type: 'PushEvent',
    repo: 'agussantinelli/GitData',
    date: '2023-10-01T12:00:00Z',
    description: 'Initial commit'
  },
  {
    id: '2',
    type: 'IssuesEvent',
    repo: 'agussantinelli/TestRepo',
    date: '2023-10-02T15:30:00Z',
    description: 'Opened issue'
  }
];

describe('ActivityStreamWidget', () => {
  it('renders correctly with default props (es/dark)', () => {
    const { container } = render(<ActivityStreamWidget activityStream={mockActivityStream} />);
    expect(screen.getByText('Actividad Reciente')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('theme-dark');
    expect(screen.getByText('agussantinelli/GitData')).toBeInTheDocument();
  });

  it('renders empty state correctly in default lang', () => {
    render(<ActivityStreamWidget activityStream={[]} />);
    expect(screen.getByText('No hay actividad reciente disponible.')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<ActivityStreamWidget activityStream={mockActivityStream} lang="en" />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (pt)', () => {
    render(<ActivityStreamWidget activityStream={mockActivityStream} lang="pt" />);
    expect(screen.getByText('Atividade Recente')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (fr)', () => {
    render(<ActivityStreamWidget activityStream={mockActivityStream} lang="fr" />);
    expect(screen.getByText('Activité Récente')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (it)', () => {
    render(<ActivityStreamWidget activityStream={mockActivityStream} lang="it" />);
    expect(screen.getByText('Attività Recente')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<ActivityStreamWidget activityStream={mockActivityStream} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('handles invalid date string gracefully', () => {
    const badDate = [{ id: '3', type: 'PushEvent', repo: 'repo', date: 'invalid-date', description: 'msg' }];
    render(<ActivityStreamWidget activityStream={badDate} />);
    expect(screen.getByText('repo')).toBeInTheDocument();
  });

  it('renders very long descriptions (truncation handled via CSS)', () => {
    const longDesc = 'A'.repeat(300);
    const longData = [{ id: '4', type: 'PushEvent', repo: 'repo', date: '2023-10-01T12:00:00Z', description: longDesc }];
    const { container } = render(<ActivityStreamWidget activityStream={longData} />);
    const typeNode = container.querySelector('.activity-type');
    expect(typeNode?.textContent).toBe(longDesc);
  });

  it('renders a large list of activities', () => {
    const largeList = new Array(15).fill(0).map((_, i) => ({
      id: `id-${i}`, type: 'PushEvent', repo: `repo-${i}`, date: '2023-10-01T12:00:00Z', description: `msg ${i}`
    }));
    const { container } = render(<ActivityStreamWidget activityStream={largeList} />);
    expect(container.querySelectorAll('.activity-item').length).toBe(15);
  });
});
