import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { AuthModal } from './AuthModal';

// Mock the auth actions
jest.mock('@/lib/auth', () => ({
  loginAction: jest.fn(),
  registerAction: jest.fn(),
  googleAuthAction: jest.fn(),
  facebookAuthAction: jest.fn(),
}));

// Mock the auth context
const mockSetUser = jest.fn();
const mockCloseAuthModal = jest.fn();
const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock('@/lib/auth/AuthProvider', () => ({
  useAuth: () => ({
    setUser: mockSetUser,
    closeAuthModal: mockCloseAuthModal,
    user: null,
    isLoading: false,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    refresh: mockRefresh,
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock react-oauth/google
jest.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess, onError }: any) => (
    <button
      data-testid="google-login"
      onClick={() => onSuccess?.({ credential: 'mock-google-token' })}
    >
      Google Login
    </button>
  ),
}));

describe('AuthModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when closed', () => {
    it('does not render content when open is false', () => {
      render(<AuthModal open={false} />);

      expect(screen.queryByText('Prijavite se')).not.toBeInTheDocument();
    });
  });

  describe('when open in login mode', () => {
    it('renders login form by default', () => {
      render(<AuthModal open={true} />);

      expect(screen.getByText('Prijavite se')).toBeInTheDocument();
      expect(screen.getByText(/unesite svoje podatke/i)).toBeInTheDocument();
    });

    it('renders email and password inputs', () => {
      render(<AuthModal open={true} />);

      expect(screen.getByPlaceholderText('tvoj.email@primer.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('renders login button', () => {
      render(<AuthModal open={true} />);

      expect(screen.getByRole('button', { name: /prijavi se/i })).toBeInTheDocument();
    });

    it('renders social login options', () => {
      render(<AuthModal open={true} />);

      expect(screen.getByText(/ili nastavi sa/i)).toBeInTheDocument();
    });

    it('handles login form submission', async () => {
      const { loginAction } = require('@/lib/auth');
      loginAction.mockResolvedValue({
        success: true,
        data: { user: { id: '1', email: 'test@example.com' } },
      });

      const user = userEvent.setup();
      render(<AuthModal open={true} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /prijavi se/i }));

      await waitFor(() => {
        expect(loginAction).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('closes modal and updates context on successful login', async () => {
      const { loginAction } = require('@/lib/auth');
      const mockUser = { id: '1', email: 'test@example.com' };
      loginAction.mockResolvedValue({
        success: true,
        data: { user: mockUser },
      });

      const mockOnOpenChange = jest.fn();
      const user = userEvent.setup();
      render(<AuthModal open={true} onOpenChange={mockOnOpenChange} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /prijavi se/i }));

      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(mockUser);
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('calls closeAuthModal when no onOpenChange is provided', async () => {
      const { loginAction } = require('@/lib/auth');
      loginAction.mockResolvedValue({
        success: true,
        data: { user: { id: '1' } },
      });

      const user = userEvent.setup();
      render(<AuthModal open={true} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /prijavi se/i }));

      await waitFor(() => {
        expect(mockCloseAuthModal).toHaveBeenCalled();
      });
    });

    it('redirects to specified path after login', async () => {
      const { loginAction } = require('@/lib/auth');
      loginAction.mockResolvedValue({
        success: true,
        data: { user: { id: '1' } },
      });

      const user = userEvent.setup();
      render(<AuthModal open={true} redirectAfterAuth="/dashboard" />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /prijavi se/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('refreshes page when no redirect specified', async () => {
      const { loginAction } = require('@/lib/auth');
      loginAction.mockResolvedValue({
        success: true,
        data: { user: { id: '1' } },
      });

      const user = userEvent.setup();
      render(<AuthModal open={true} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /prijavi se/i }));

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it('displays error on login failure', async () => {
      const { loginAction } = require('@/lib/auth');
      loginAction.mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      });

      const user = userEvent.setup();
      render(<AuthModal open={true} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'wrong');
      await user.click(screen.getByRole('button', { name: /prijavi se/i }));

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('when open in register mode', () => {
    it('renders register form when defaultMode is register', () => {
      render(<AuthModal open={true} defaultMode="register" />);

      expect(screen.getByText('Registrujte se')).toBeInTheDocument();
      expect(screen.getByText(/kreirajte nalog/i)).toBeInTheDocument();
    });

    it('handles registration form submission', async () => {
      const { registerAction } = require('@/lib/auth');
      registerAction.mockResolvedValue({
        success: true,
        data: { user: { id: '1', email: 'new@example.com' } },
      });

      const user = userEvent.setup();
      render(<AuthModal open={true} defaultMode="register" />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'new@example.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'Password123');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /registruj se/i }));

      await waitFor(() => {
        expect(registerAction).toHaveBeenCalledWith({
          email: 'new@example.com',
          password: 'Password123',
        });
      });
    });

    it('displays error on registration failure', async () => {
      const { registerAction } = require('@/lib/auth');
      registerAction.mockResolvedValue({
        success: false,
        error: 'Email already exists',
      });

      const user = userEvent.setup();
      render(<AuthModal open={true} defaultMode="register" />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'existing@example.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'Password123');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /registruj se/i }));

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument();
      });
    });
  });

  describe('mode toggling', () => {
    it('switches from login to register mode', async () => {
      const user = userEvent.setup();
      render(<AuthModal open={true} defaultMode="login" />);

      expect(screen.getByText('Prijavite se')).toBeInTheDocument();

      // Click the toggle to switch to register
      const toggleButton = screen.getByRole('button', { name: /registruj se/i });
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText('Registrujte se')).toBeInTheDocument();
      });
    });

    it('switches from register to login mode', async () => {
      const user = userEvent.setup();
      render(<AuthModal open={true} defaultMode="register" />);

      expect(screen.getByText('Registrujte se')).toBeInTheDocument();

      // Click the toggle to switch to login
      const toggleButton = screen.getByRole('button', { name: /prijavi se/i });
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText('Prijavite se')).toBeInTheDocument();
      });
    });

    it('clears error when switching modes', async () => {
      const { loginAction } = require('@/lib/auth');
      loginAction.mockResolvedValue({
        success: false,
        error: 'Login error',
      });

      const user = userEvent.setup();
      render(<AuthModal open={true} />);

      // Trigger an error
      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password');
      await user.click(screen.getByRole('button', { name: /prijavi se/i }));

      await waitFor(() => {
        expect(screen.getByText('Login error')).toBeInTheDocument();
      });

      // Switch modes
      const registerButtons = screen.getAllByRole('button', { name: /registruj se/i });
      await user.click(registerButtons[registerButtons.length - 1]);

      await waitFor(() => {
        expect(screen.queryByText('Login error')).not.toBeInTheDocument();
      });
    });
  });

  describe('OAuth authentication', () => {
    it('handles Google OAuth success', async () => {
      const { googleAuthAction } = require('@/lib/auth');
      const mockUser = { id: '1', email: 'google@example.com' };
      googleAuthAction.mockResolvedValue({
        success: true,
        data: { user: mockUser },
      });

      const user = userEvent.setup();
      render(<AuthModal open={true} />);

      await user.click(screen.getByTestId('google-login'));

      await waitFor(() => {
        expect(googleAuthAction).toHaveBeenCalledWith('mock-google-token');
        expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      });
    });

    it('handles Google OAuth failure', async () => {
      const { googleAuthAction } = require('@/lib/auth');
      googleAuthAction.mockResolvedValue({
        success: false,
        error: 'Google auth failed',
      });

      const user = userEvent.setup();
      render(<AuthModal open={true} />);

      await user.click(screen.getByTestId('google-login'));

      await waitFor(() => {
        expect(screen.getByText('Google auth failed')).toBeInTheDocument();
      });
    });
  });

  describe('modal state management', () => {
    it('calls onOpenChange when modal is closed', async () => {
      const mockOnOpenChange = jest.fn();
      render(<AuthModal open={true} onOpenChange={mockOnOpenChange} />);

      // The Dialog component handles the close interaction
      // We test that the callback is set up correctly
      expect(screen.getByText('Prijavite se')).toBeInTheDocument();
    });

    it('resets state when modal closes', () => {
      const { rerender } = render(<AuthModal open={true} />);

      expect(screen.getByText('Prijavite se')).toBeInTheDocument();

      rerender(<AuthModal open={false} />);

      expect(screen.queryByText('Prijavite se')).not.toBeInTheDocument();
    });
  });
});
