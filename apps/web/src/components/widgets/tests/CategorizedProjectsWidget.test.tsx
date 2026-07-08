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
    homepageUrl: null,
    primaryLanguage: 'TypeScript',
    sizeKb: 2048,
    isArchived: false,
    isPrivate: false,
    isFork: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-10-01T00:00:00Z',
    openIssues: 5,
    openPullRequests: 2,
    license: 'MIT',
    watchers: 50,
    collaborators: 2,
    totalCommits: 50
  },
  {
    name: 'Sysacad',
    description: null,
    stars: 200,
    forks: 5,
    url: 'https://github.com/agussantinelli/Sysacad',
    homepageUrl: null,
    primaryLanguage: 'Java',
    sizeKb: 500, // < 1024 to test KB formatting
    isArchived: false,
    isPrivate: false,
    isFork: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-09-01T00:00:00Z',
    openIssues: 0,
    openPullRequests: 0,
    license: null,
    watchers: 10,
    collaborators: 1,
    totalCommits: 100
  }
];

describe('CategorizedProjectsWidget', () => {
  it('renders correctly with default props (es/dark)', () => {
    const { container } = render(<CategorizedProjectsWidget projects={mockProjects} />);
    expect(screen.getByText('Resumen de Proyectos')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('theme-dark');
    expect(screen.getAllByText('GitData').length).toBeGreaterThan(0);
  });

  it('renders empty state correctly', () => {
    const { container } = render(<CategorizedProjectsWidget projects={[]} />);
    expect(container.querySelector('.project-item')).not.toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<CategorizedProjectsWidget projects={mockProjects} lang="en" />);
    expect(screen.getByText('Projects Overview')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (pt)', () => {
    render(<CategorizedProjectsWidget projects={mockProjects} lang="pt" />);
    expect(screen.getByText('Resumo de Projetos')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (fr)', () => {
    render(<CategorizedProjectsWidget projects={mockProjects} lang="fr" />);
    expect(screen.getByText('Aperçu des Projets')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (it)', () => {
    render(<CategorizedProjectsWidget projects={mockProjects} lang="it" />);
    expect(screen.getByText('Panoramica Progetti')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<CategorizedProjectsWidget projects={mockProjects} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('highlights stars in the top stars section', () => {
    const { container } = render(<CategorizedProjectsWidget projects={mockProjects} />);
    const starSection = container.querySelectorAll('.category-section')[0];
    // Stars stat should be present
    expect(starSection.textContent).toContain('100');
  });

  it('highlights commits in the most commits section', () => {
    const { container } = render(<CategorizedProjectsWidget projects={mockProjects} />);
    const commitSection = container.querySelectorAll('.category-section')[2];
    // Commit stat should be present
    expect(commitSection.textContent).toContain('100');
  });

  it('handles missing descriptions and languages gracefully', () => {
    const missingData = [{ ...mockProjects[0], description: null, primaryLanguage: null }];
    render(<CategorizedProjectsWidget projects={missingData} />);
    // Should not crash, and should not display the language dot if missing
    expect(screen.getAllByText('GitData').length).toBeGreaterThan(0);
  });

  it('renders gracefully when a category has 0 projects', () => {
    // Only pass projects that don't fit into one category (e.g., 0 forks, 0 stars)
    const noStarsNoForks = [{ ...mockProjects[0], stars: 0, forks: 0 }];
    render(<CategorizedProjectsWidget projects={noStarsNoForks} />);
    // Debería seguir funcionando, tal vez mostrando 0 en la UI
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  it('handles extremely large numbers without crashing', () => {
    const hugeNumbers = [{ ...mockProjects[0], stars: 9999999, forks: 9999999, openIssues: 9999999, sizeKb: 999999999 }];
    render(<CategorizedProjectsWidget projects={hugeNumbers} />);
    // Solo validamos que el componente no explote y renderice algún nombre
    expect(screen.getAllByText('GitData').length).toBeGreaterThan(0);
  });

  it('truncates or handles extremely long names and descriptions', () => {
    const longTexts = [{ ...mockProjects[0], name: 'A'.repeat(200), description: 'B'.repeat(500) }];
    render(<CategorizedProjectsWidget projects={longTexts} />);
    expect(screen.getAllByText('A'.repeat(200)).length).toBeGreaterThan(0);
  });
});
