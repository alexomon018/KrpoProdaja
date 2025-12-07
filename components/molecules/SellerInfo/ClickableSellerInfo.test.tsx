import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import { ClickableSellerInfo } from './ClickableSellerInfo';
import { mockUser } from '@/__tests__/mocks/data';

const mockPush = jest.fn();
const mockRequireAuth = jest.fn((callback: () => void) => callback());

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/providers/AuthProvider', () => ({
  useRequireAuth: () => ({
    requireAuth: mockRequireAuth,
  }),
}));

describe('ClickableSellerInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders seller info', () => {
    render(<ClickableSellerInfo seller={mockUser} />);
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('navigates to seller profile when profile is clicked', async () => {
    render(<ClickableSellerInfo seller={mockUser} />);

    const profileButton = screen.getByRole('button', { name: /profil/i });
    fireEvent.click(profileButton);

    expect(mockPush).toHaveBeenCalledWith(`/profile/${mockUser.id}`);
  });

  it('requires auth and logs message when message button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<ClickableSellerInfo seller={mockUser} />);

    const messageButton = screen.getByRole('button', { name: /poruku/i });
    fireEvent.click(messageButton);

    expect(mockRequireAuth).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Open message to seller:', mockUser.id);

    consoleSpy.mockRestore();
  });

  it('renders in compact mode', () => {
    render(<ClickableSellerInfo seller={mockUser} compact />);
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });
});
