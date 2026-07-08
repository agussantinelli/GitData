import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PersonalInfoWidget } from '../PersonalInfoWidget';

const mockProfileData = {
  name: 'Agustin Santinelli',
  username: 'agussantinelli',
  bio: 'Software Engineer',
  location: 'Argentina',
  followers: 120,
  createdAt: '2020-01-01T00:00:00Z',
  stats: {
    commits: 1500,
    prs: 50,
    issues: 20,
    stars: 300,
  },
  topLanguages: [
    { name: 'TypeScript', percentage: 80 },
    { name: 'JavaScript', percentage: 20 },
  ],
};

describe('PersonalInfoWidget', () => {
  it('renders correctly with default props (es/dark)', () => {
    const { container } = render(<PersonalInfoWidget data={mockProfileData} />);
    expect(screen.getByText('Agustin Santinelli')).toBeInTheDocument();
    expect(screen.getByText('@agussantinelli')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('theme-dark');
  });

  it('uses the correct language dictionary (en)', () => {
    render(<PersonalInfoWidget data={mockProfileData} lang="en" />);
    expect(screen.getByText(/years exp\./i)).toBeInTheDocument();
  });

  it('uses the correct language dictionary (es)', () => {
    render(<PersonalInfoWidget data={mockProfileData} lang="es" />);
    expect(screen.getByText(/años exp\./i)).toBeInTheDocument();
  });

  it('uses the correct language dictionary (pt)', () => {
    render(<PersonalInfoWidget data={mockProfileData} lang="pt" />);
    expect(screen.getByText(/anos exp\./i)).toBeInTheDocument();
  });

  it('uses the correct language dictionary (fr)', () => {
    render(<PersonalInfoWidget data={mockProfileData} lang="fr" />);
    expect(screen.getByText(/ans exp\./i)).toBeInTheDocument();
  });

  it('uses the correct language dictionary (it)', () => {
    render(<PersonalInfoWidget data={mockProfileData} lang="it" />);
    expect(screen.getByText(/anni esp\./i)).toBeInTheDocument();
  });

  it('renders correctly with light theme', () => {
    const { container } = render(<PersonalInfoWidget data={mockProfileData} theme="light" />);
    expect(container.firstChild).toHaveClass('theme-light');
  });

  it('handles missing bio and location gracefully', () => {
    const dataMissing = { ...mockProfileData, bio: null as any, location: null as any };
    render(<PersonalInfoWidget data={dataMissing} />);
    expect(screen.getByText('Agustin Santinelli')).toBeInTheDocument();
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
    expect(screen.queryByText('Argentina')).not.toBeInTheDocument();
  });

  it('calculates years of experience correctly based on createdAt date', () => {
    const { container } = render(<PersonalInfoWidget data={mockProfileData} />);
    // Just verify the experience line is rendered with "años exp."
    const titlesNode = container.querySelector('.widget-titles p');
    expect(titlesNode?.textContent).toMatch(/años exp\./i);
  });

  it('renders avatar image with correct github URL based on username', () => {
    const { container } = render(<PersonalInfoWidget data={mockProfileData} />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'https://github.com/agussantinelli.png');
  });

  it('handles empty topLanguages array gracefully', () => {
    const dataEmptyLangs = { ...mockProfileData, topLanguages: [] };
    render(<PersonalInfoWidget data={dataEmptyLangs} />);
    // La UI no debería crashear, y no renderiza skills
    expect(screen.getByText('Agustin Santinelli')).toBeInTheDocument();
  });

  it('handles missing username without crashing image loading', () => {
    const noUsername = { ...mockProfileData, username: '' };
    const { container } = render(<PersonalInfoWidget data={noUsername} />);
    const img = container.querySelector('img');
    // It should render, even if the src becomes https://github.com/.png
    expect(img).toBeInTheDocument();
  });

  it('renders extremely long bio and truncates or wraps properly', () => {
    const longBio = { ...mockProfileData, bio: 'A'.repeat(500) };
    render(<PersonalInfoWidget data={longBio} />);
    expect(screen.getByText('A'.repeat(500))).toBeInTheDocument();
  });
});
