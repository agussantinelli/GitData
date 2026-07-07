import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from '../Avatar';
import React from 'react';

describe('Avatar', () => {
  it('renders correctly with default props', () => {
    render(<Avatar src="https://example.com/avatar.png" alt="User avatar" />);
    const img = screen.getByAltText('User avatar') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/avatar.png');
    expect(img.getAttribute('width')).toBe('64');
    expect(img.getAttribute('height')).toBe('64');
    expect(img).toHaveClass('gitdata-avatar');
  });

  it('renders correctly with custom props', () => {
    render(
      <Avatar 
        src="https://example.com/custom.png" 
        alt="Custom avatar" 
        size={128} 
        className="custom-class" 
      />
    );
    const img = screen.getByAltText('Custom avatar') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/custom.png');
    expect(img.getAttribute('width')).toBe('128');
    expect(img.getAttribute('height')).toBe('128');
    expect(img).toHaveClass('gitdata-avatar', 'custom-class');
  });

  it('renders correctly with empty alt text', () => {
    const { container } = render(<Avatar src="https://example.com/img.png" alt="" />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', '');
  });

  it('handles extremely small size values', () => {
    render(<Avatar src="test.png" alt="small" size={0} />);
    const img = screen.getByAltText('small');
    expect(img).toHaveAttribute('width', '0');
    expect(img).toHaveAttribute('height', '0');
  });

  it('handles extremely large size values', () => {
    render(<Avatar src="test.png" alt="large" size={10000} />);
    const img = screen.getByAltText('large');
    expect(img).toHaveAttribute('width', '10000');
    expect(img).toHaveAttribute('height', '10000');
  });

  it('renders correctly with unicode characters in alt text', () => {
    render(<Avatar src="test.png" alt="👤 Usuario ñáéíóú" />);
    const img = screen.getByAltText('👤 Usuario ñáéíóú');
    expect(img).toBeInTheDocument();
  });

  it('applies multiple custom classes correctly', () => {
    render(<Avatar src="test.png" alt="multiple" className="class1 class2 class3" />);
    const img = screen.getByAltText('multiple');
    expect(img).toHaveClass('gitdata-avatar', 'class1', 'class2', 'class3');
  });

  it('handles empty src string gracefully', () => {
    const { container } = render(<Avatar src="" alt="empty src" />);
    const img = container.querySelector('img');
    const src = img?.getAttribute('src');
    expect(src === '' || src === null).toBeTruthy();
  });

  it('handles undefined className by falling back to default classes only', () => {
    render(<Avatar src="test.png" alt="undefined class" className={undefined} />);
    const img = screen.getByAltText('undefined class');
    expect(img.className.trim()).toBe('gitdata-avatar');
  });

  it('renders properly with relative src paths', () => {
    render(<Avatar src="/local/path/image.png" alt="relative src" />);
    const img = screen.getByAltText('relative src') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('/local/path/image.png');
  });

  // Adding 20 more tests
  it('does not apply unknown props to the element implicitly if not spread (structural test)', () => {
    const { container } = render(<Avatar src="test.png" alt="no extra" {...{ 'data-unknown': 'test' } as any} />);
    const img = container.querySelector('img');
    expect(img).not.toHaveAttribute('data-unknown');
  });

  it('maintains the correct aspect ratio (width equals height)', () => {
    render(<Avatar src="test.png" alt="aspect" size={88} />);
    const img = screen.getByAltText('aspect');
    expect(img.getAttribute('width')).toEqual(img.getAttribute('height'));
  });

  it('works correctly inside a flex container', () => {
    const { container } = render(<div style={{ display: 'flex' }}><Avatar src="test.png" alt="flex" /></div>);
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('can be queried by role', () => {
    render(<Avatar src="test.png" alt="role test" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
  });

  it('is visible to screen readers due to alt text', () => {
    render(<Avatar src="test.png" alt="screen reader visible" />);
    const img = screen.getByAltText('screen reader visible');
    expect(img).toBeVisible();
  });

  it('renders safely when size is a negative number (even if invalid HTML, component allows it)', () => {
    render(<Avatar src="test.png" alt="negative size" size={-10} />);
    const img = screen.getByAltText('negative size');
    expect(img).toHaveAttribute('width', '-10');
  });

  it('renders correctly with an SVG data URI', () => {
    const svgUri = 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=';
    render(<Avatar src={svgUri} alt="svg src" />);
    const img = screen.getByAltText('svg src');
    expect(img.getAttribute('src')).toBe(svgUri);
  });

  it('renders correctly with a Base64 PNG data URI', () => {
    const pngUri = 'data:image/png;base64,iVBORw0KGgo=';
    render(<Avatar src={pngUri} alt="png src" />);
    const img = screen.getByAltText('png src');
    expect(img.getAttribute('src')).toBe(pngUri);
  });

  it('applies standard box model properly (no inline styles that break it)', () => {
    render(<Avatar src="test.png" alt="box model" />);
    const img = screen.getByAltText('box model');
    expect(img.style.margin).toBe('');
  });

  it('does not have inline styles by default', () => {
    render(<Avatar src="test.png" alt="no inline styles" />);
    const img = screen.getByAltText('no inline styles');
    expect(img.getAttribute('style')).toBeNull();
  });

  it('accepts long alt text without breaking', () => {
    const longAlt = 'a'.repeat(500);
    render(<Avatar src="test.png" alt={longAlt} />);
    expect(screen.getByAltText(longAlt)).toBeInTheDocument();
  });

  it('accepts long src strings without breaking', () => {
    const longSrc = 'https://example.com/' + 'a'.repeat(500) + '.png';
    render(<Avatar src={longSrc} alt="long src" />);
    const img = screen.getByAltText('long src');
    expect(img.getAttribute('src')).toBe(longSrc);
  });

  it('renders accurately when rerendered with new props', () => {
    const { rerender } = render(<Avatar src="test1.png" alt="test1" size={10} />);
    rerender(<Avatar src="test2.png" alt="test2" size={20} />);
    const img = screen.getByAltText('test2');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('width')).toBe('20');
  });

  it('behaves deterministically when unmounted', () => {
    const { unmount, container } = render(<Avatar src="test.png" alt="unmount" />);
    unmount();
    expect(container).toBeEmptyDOMElement();
  });

  it('fires standard events if they were attached (though component currently does not accept them, it is a valid DOM node)', () => {
    // Just a structural test
    render(<Avatar src="test.png" alt="events" />);
    const img = screen.getByAltText('events');
    expect(() => fireEvent.click(img)).not.toThrow();
  });

  it('has no text content inside the img tag', () => {
    render(<Avatar src="test.png" alt="no text" />);
    const img = screen.getByAltText('no text');
    expect(img.textContent).toBe('');
  });

  it('handles spaces in src correctly', () => {
    render(<Avatar src="https://example.com/my avatar.png" alt="space src" />);
    const img = screen.getByAltText('space src');
    expect(img.getAttribute('src')).toBe('https://example.com/my avatar.png');
  });

  it('handles special characters in src URL', () => {
    const trickySrc = 'https://example.com/avatar?name=agus&id=123#hash';
    render(<Avatar src={trickySrc} alt="tricky src" />);
    const img = screen.getByAltText('tricky src');
    expect(img.getAttribute('src')).toBe(trickySrc);
  });

  it('retains gitdata-avatar class even with empty string passed to className', () => {
    render(<Avatar src="test.png" alt="empty class" className="" />);
    const img = screen.getByAltText('empty class');
    expect(img.className.trim()).toBe('gitdata-avatar');
  });

  it('renders a valid semantic HTML image tag', () => {
    const { container } = render(<Avatar src="test.png" alt="semantic" />);
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe('IMG');
  });
});
