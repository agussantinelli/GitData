import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeLifeBalanceWidget } from '../CodeLifeBalanceWidget';

const mockBalance = {
  weekdays: 80,
  weekends: 20
};

describe('CodeLifeBalanceWidget', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<CodeLifeBalanceWidget balance={mockBalance} />);
    
    // Check title
    expect(screen.getByText('Code-Life Balance')).toBeInTheDocument();
    
    // Check if the theme wrapper is applied (default is dark)
    expect(container.firstChild).toHaveClass('theme-dark');

    // Check content
    expect(screen.getByText('Lunes a Viernes')).toBeInTheDocument();
    expect(screen.getByText('Sábado y Domingo')).toBeInTheDocument();
  });

  it('uses the correct language dictionary (en)', () => {
    render(<CodeLifeBalanceWidget balance={mockBalance} lang="en" />);
    // Weekdays in English
    expect(screen.getByText('Weekdays')).toBeInTheDocument();
    expect(screen.getByText('Weekends')).toBeInTheDocument();
  });
});
