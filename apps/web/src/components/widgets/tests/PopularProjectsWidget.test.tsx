import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PopularProjectsWidget } from '../PopularProjectsWidget';

const mockProjects = [
  {
    name: 'GitData',
    description: 'Github Analytics tool',
    stars: 100,
    forks: 10,
    url: 'https://github.com/agussantinelli/GitData',
    primaryLanguage: 'TypeScript',
    sizeKb: 2048,
    updatedAt: '2023-10-01',
    totalCommits: 50
  }
];

describe('PopularProjectsWidget', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<PopularProjectsWidget projects={mockProjects} />);
    
    // Check title
    expect(screen.getByText('Proyectos Destacados')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied
    expect(container.firstChild).toHaveClass('theme-dark');

    // Check content
    expect(screen.getByText('GitData')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    const { container } = render(<PopularProjectsWidget projects={[]} />);
    expect(container.querySelector('.project-item')).not.toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<PopularProjectsWidget projects={mockProjects} lang="en" />);
    // English title
    expect(screen.getByText('Popular Projects')).toBeInTheDocument();
  });
});
