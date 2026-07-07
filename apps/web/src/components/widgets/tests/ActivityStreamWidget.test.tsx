import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityStreamWidget } from '../ActivityStreamWidget';

const mockActivityStream = [
  {
    type: 'PushEvent',
    repo: 'agussantinelli/GitData',
    date: '2023-10-01T12:00:00Z',
    message: 'Initial commit'
  },
  {
    type: 'IssuesEvent',
    repo: 'agussantinelli/TestRepo',
    date: '2023-10-02T15:30:00Z',
    message: 'Opened issue'
  }
];

describe('ActivityStreamWidget', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<ActivityStreamWidget activityStream={mockActivityStream} />);
    
    // Check main elements
    expect(screen.getByText('Actividad Reciente')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied (default is dark)
    expect(container.firstChild).toHaveClass('theme-dark');

    // Check content
    expect(screen.getByText('agussantinelli/GitData')).toBeInTheDocument();
    expect(screen.getByText('agussantinelli/TestRepo')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    render(<ActivityStreamWidget activityStream={[]} />);
    // Translation for no data in default 'es' lang
    expect(screen.getByText('No hay actividad reciente disponible.')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<ActivityStreamWidget activityStream={mockActivityStream} lang="en" />);
    // Title in English
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });
});
