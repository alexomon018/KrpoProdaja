import { render, screen } from '@/__tests__/utils/test-utils';
import { Search, Heart, MessageCircle, User } from './Icon';

describe('Icon', () => {
  it('renders Search icon', () => {
    render(<Search data-testid="search-icon" />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('renders Heart icon', () => {
    render(<Heart data-testid="heart-icon" />);
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('renders MessageCircle icon', () => {
    render(<MessageCircle data-testid="message-icon" />);
    expect(screen.getByTestId('message-icon')).toBeInTheDocument();
  });

  it('renders User icon', () => {
    render(<User data-testid="user-icon" />);
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('accepts size prop', () => {
    render(<Search size={24} data-testid="sized-icon" />);
    expect(screen.getByTestId('sized-icon')).toBeInTheDocument();
  });
});
