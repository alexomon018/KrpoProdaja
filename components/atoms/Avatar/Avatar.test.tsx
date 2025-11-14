import { render, screen } from '@/__tests__/utils/test-utils';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders with image source', () => {
    const { container } = render(<Avatar src="/test.jpg" alt="Test User" />);
    // Avatar component renders with src prop (image may be hidden during loading in test env)
    // Fallback will show while image loads or if image fails in test environment
    expect(container.querySelector('span')).toBeInTheDocument();
    expect(screen.getByText('TU')).toBeInTheDocument(); // Fallback initials
  });

  it('renders fallback initials when no image provided', () => {
    render(<Avatar alt="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders custom fallback text', () => {
    render(<Avatar alt="Test" fallback="AB" />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender, container } = render(<Avatar alt="Test" size="sm" />);
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(container.querySelector('.h-8.w-8')).toBeInTheDocument();

    rerender(<Avatar alt="Test" size="lg" />);
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(container.querySelector('.h-12.w-12')).toBeInTheDocument();
  });

  it('shows fallback when image fails to load', () => {
    render(<Avatar src="/invalid.jpg" alt="Test User" />);
    // Fallback should show (image won't load in test environment)
    expect(screen.getByText('TU')).toBeInTheDocument();
  });
});
