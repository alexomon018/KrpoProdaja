import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders with image source', () => {
    render(<Avatar src="/test.jpg" alt="Test User" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Test User');
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
    const { rerender } = render(<Avatar alt="Test" size="sm" />);
    expect(screen.getByText('T')).toBeInTheDocument();

    rerender(<Avatar alt="Test" size="lg" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('shows fallback when image fails to load', () => {
    render(<Avatar src="/invalid.jpg" alt="Test User" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(screen.getByText('TU')).toBeInTheDocument();
  });
});
