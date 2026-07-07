import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategorizedProjectsWidget } from '../CategorizedProjectsWidget';

const mockProjects = [
  {
    name: 'GitData',
    description: 'Github Analytics',
    stars: 100,
    forks: 10,
    url: 'https://github.com/agussantinelli/GitData',
    primaryLanguage: 'TypeScript',
    sizeKb: 2048,
    updatedAt: '2023-10-01T00:00:00Z',
    totalCommits: 50
  },
  {
    name: 'Sysacad',
    description: null,
    stars: 200,
    forks: 5,
    url: 'https://github.com/agussantinelli/Sysacad',
    primaryLanguage: 'Java',
    sizeKb: 1024,
    updatedAt: '2023-09-01T00:00:00Z',
    totalCommits: 100
  }
];

describe('CategorizedProjectsWidget', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<CategorizedProjectsWidget projects={mockProjects} />);
    
    // Check title (default 'es')
    expect(screen.getByText('Resumen de Proyectos')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied (default is dark)
    expect(container.firstChild).toHaveClass('theme-dark');

    // Check content
    expect(screen.getAllByText('GitData').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sysacad').length).toBeGreaterThan(0);
  });

  it('renders empty state correctly', () => {
    const { container } = render(<CategorizedProjectsWidget projects={[]} />);
    expect(container.querySelector('.project-item')).not.toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<CategorizedProjectsWidget projects={mockProjects} lang="en" />);
    // Title in English
    expect(screen.getByText('Projects Overview')).toBeInTheDocument();
  });
});
