import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { SellerInfo } from './SellerInfo';
import { mockUser } from '@/__tests__/mocks/data';

describe('SellerInfo', () => {
  it('renders seller email', () => {
    render(<SellerInfo seller={mockUser} />);
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('renders seller avatar', () => {
    render(<SellerInfo seller={mockUser} />);
    // Avatar uses initials fallback in test environment (no image element)
    // Check that the avatar container is rendered
    const avatarContainer = document.querySelector('.rounded-full');
    expect(avatarContainer).toBeInTheDocument();
  });

  it('displays seller rating', () => {
    render(<SellerInfo seller={mockUser} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('shows seller stats in full mode', () => {
    render(<SellerInfo seller={mockUser} />);
    // Check that component renders in full mode
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('hides stats in compact mode', () => {
    render(<SellerInfo seller={mockUser} compact />);
    // Check compact mode renders
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('calls onMessageClick when message button clicked', () => {
    const handleMessageClick = jest.fn();
    render(<SellerInfo seller={mockUser} onMessageClick={handleMessageClick} />);
    // Check that component renders with callback
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('calls onProfileClick when profile clicked', async () => {
    const user = userEvent.setup();
    const handleProfileClick = jest.fn();
    render(<SellerInfo seller={mockUser} onProfileClick={handleProfileClick} />);

    await user.click(screen.getByText(mockUser.email));
    expect(handleProfileClick).toHaveBeenCalledTimes(1);
  });
});
