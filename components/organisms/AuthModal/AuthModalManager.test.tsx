import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { AuthModalManager } from './AuthModalManager';

// Mock the AuthModal component
jest.mock('./AuthModal', () => ({
  AuthModal: ({ open, onOpenChange, defaultMode, redirectAfterAuth }: any) => (
    <div data-testid="auth-modal">
      <span data-testid="modal-open">{String(open)}</span>
      <span data-testid="modal-mode">{defaultMode}</span>
      <span data-testid="modal-redirect">{redirectAfterAuth || 'none'}</span>
      <button data-testid="close-modal" onClick={() => onOpenChange(false)}>
        Close
      </button>
    </div>
  ),
}));

// Mock the auth context
const mockCloseAuthModal = jest.fn();
let mockAuthModalState: {
  isOpen: boolean;
  mode: 'login' | 'register';
  redirectAfterAuth: string | undefined;
} = {
  isOpen: false,
  mode: 'login',
  redirectAfterAuth: undefined,
};

jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({
    authModalState: mockAuthModalState,
    closeAuthModal: mockCloseAuthModal,
    user: null,
    isLoading: false,
    setUser: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('AuthModalManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthModalState = {
      isOpen: false,
      mode: 'login',
      redirectAfterAuth: undefined,
    };
  });

  it('renders AuthModal component', () => {
    render(<AuthModalManager />);

    expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
  });

  it('passes isOpen state from auth context', () => {
    mockAuthModalState.isOpen = true;
    render(<AuthModalManager />);

    expect(screen.getByTestId('modal-open')).toHaveTextContent('true');
  });

  it('passes closed state when modal is not open', () => {
    mockAuthModalState.isOpen = false;
    render(<AuthModalManager />);

    expect(screen.getByTestId('modal-open')).toHaveTextContent('false');
  });

  it('passes login mode from auth context', () => {
    mockAuthModalState.mode = 'login';
    render(<AuthModalManager />);

    expect(screen.getByTestId('modal-mode')).toHaveTextContent('login');
  });

  it('passes register mode from auth context', () => {
    mockAuthModalState.mode = 'register';
    render(<AuthModalManager />);

    expect(screen.getByTestId('modal-mode')).toHaveTextContent('register');
  });

  it('passes redirectAfterAuth from auth context', () => {
    mockAuthModalState.redirectAfterAuth = '/profile';
    render(<AuthModalManager />);

    expect(screen.getByTestId('modal-redirect')).toHaveTextContent('/profile');
  });

  it('calls closeAuthModal when modal requests to close', async () => {
    const user = userEvent.setup();

    mockAuthModalState.isOpen = true;
    render(<AuthModalManager />);

    await user.click(screen.getByTestId('close-modal'));

    expect(mockCloseAuthModal).toHaveBeenCalled();
  });

  it('does not call closeAuthModal when modal opens', () => {
    mockAuthModalState.isOpen = true;
    render(<AuthModalManager />);

    // closeAuthModal should not be called just from rendering
    expect(mockCloseAuthModal).not.toHaveBeenCalled();
  });

  it('integrates properly with auth context state changes', () => {
    const { rerender } = render(<AuthModalManager />);

    expect(screen.getByTestId('modal-open')).toHaveTextContent('false');

    // Simulate context update
    mockAuthModalState.isOpen = true;
    mockAuthModalState.mode = 'register';
    rerender(<AuthModalManager />);

    expect(screen.getByTestId('modal-open')).toHaveTextContent('true');
    expect(screen.getByTestId('modal-mode')).toHaveTextContent('register');
  });
});
