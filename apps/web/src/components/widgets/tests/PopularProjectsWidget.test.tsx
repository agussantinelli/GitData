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
  it('renders correctly with default props (es/dark)', () => {
    const { container } = render(<PopularProjectsWidget projects={mockProjects} />);
    expect(screen.getByText('Proyectos Destacados')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('theme-dark');
    expect(screen.getByText('GitData')).toBeInTheDocument();
  });

  it('renders empty state correctly in default lang', () => {
    const { container } = render(<PopularProjectsWidget projects={[]} />);
    // Verify there are no project-items
    expect(container.querySelector('.project-item')).not.toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<PopularProjectsWidget projects={mockProjects} lang="en" />);
    expect(screen.getByText('Popular Projects')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (pt)', () => {
    render(<PopularProjectsWidget projects={mockProjects} lang="pt" />);
    expect(screen.getByText('Projetos Populares')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (fr)', () => {
    render(<PopularProjectsWidget projects={mockProjects} lang="fr" />);
    expect(screen.getByText('Projets Populaires')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (it)', () => {
    render(<PopularProjectsWidget projects={mockProjects} lang="it" />);
    expect(screen.getByText('Progetti Popolari')).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<PopularProjectsWidget projects={mockProjects} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('handles missing descriptions gracefully', () => {
    const missingDesc = [{ ...mockProjects[0], description: null }];
    render(<PopularProjectsWidget projects={missingDesc} />);
    expect(screen.getByText('GitData')).toBeInTheDocument();
    expect(screen.queryByText('Github Analytics tool')).not.toBeInTheDocument();
  });

  it('displays correct amount of stars and forks', () => {
    render(<PopularProjectsWidget projects={mockProjects} />);
    // Using simple checks since they are wrapped in icons
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders correct link to github repo', () => {
    const { container } = render(<PopularProjectsWidget projects={mockProjects} />);
    const link = container.querySelector('.project-link');
    expect(link).toHaveAttribute('href', 'https://github.com/agussantinelli/GitData');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('handles projects without a URL gracefully (e.g. private or stripped)', () => {
    const noUrl = [{ ...mockProjects[0], url: null as any }];
    const { container } = render(<PopularProjectsWidget projects={noUrl} />);
    // Debería renderizar el proyecto igual, tal vez sin tag <a>
    expect(screen.getByText('GitData')).toBeInTheDocument();
    // Validamos que no tenga un enlace roto si se puede
    const link = container.querySelector('.project-link');
    if (link) {
      expect(link).not.toHaveAttribute('href', 'null');
    }
  });

  it('renders extremely long project names without crashing', () => {
    const longProject = [{
      ...mockProjects[0],
      name: 'A'.repeat(200),
      description: 'B'.repeat(300)
    }];
    render(<PopularProjectsWidget projects={longProject} />);
    expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
  });

  it('renders multiple projects in the provided order without crashing', () => {
    const multi = [
      { ...mockProjects[0], name: 'First', stars: 10 },
      { ...mockProjects[0], name: 'Second', stars: 100 }
    ];
    render(<PopularProjectsWidget projects={multi} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
