import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>New Feature</Badge>);
    expect(screen.getByText('New Feature')).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass('gitdata-badge', 'primary');
  });

  it('applies custom variant and class', () => {
    const { container } = render(
      <Badge variant="outline" className="custom-badge">
        Outline Badge
      </Badge>
    );
    expect(container.firstChild).toHaveClass('gitdata-badge', 'outline', 'custom-badge');
  });
});
