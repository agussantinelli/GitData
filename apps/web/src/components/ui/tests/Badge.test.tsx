import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders text children correctly', () => {
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

  it('applies secondary variant correctly', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(container.firstChild).toHaveClass('gitdata-badge', 'secondary');
  });

  it('renders complex element children correctly', () => {
    render(
      <Badge>
        <span>Icon</span> Text
      </Badge>
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText(/Text/)).toBeInTheDocument();
  });

  it('handles empty children gracefully', () => {
    const { container } = render(<Badge>{null}</Badge>);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('handles multiple children gracefully', () => {
    render(
      <Badge>
        <span>One</span>
        <span>Two</span>
      </Badge>
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('applies multiple custom classes', () => {
    const { container } = render(<Badge className="class1 class2">Multi</Badge>);
    expect(container.firstChild).toHaveClass('gitdata-badge', 'primary', 'class1', 'class2');
  });

  it('handles undefined variant by falling back to default', () => {
    const { container } = render(<Badge variant={undefined}>Undefined Variant</Badge>);
    expect(container.firstChild).toHaveClass('gitdata-badge', 'primary');
  });

  it('handles undefined className gracefully', () => {
    const { container } = render(<Badge className={undefined}>Undefined Class</Badge>);
    expect(container.firstChild).toHaveClass('gitdata-badge', 'primary');
    // Ensure no "undefined" string class is added
    expect(container.firstChild).not.toHaveClass('undefined');
  });
});
