import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { AuthLogin } from './AuthLogin';

// Mock the auth actions
jest.mock('@/lib/auth', () => ({
  loginAction: jest.fn(),
  googleAuthAction: jest.fn(),
  facebookAuthAction: jest.fn(),
}));

// Mock the auth context
const mockSetUser = jest.fn();
const mockPush = jest.fn();

jest.mock('@/lib/auth/AuthProvider', () => ({
  useAuth: () => ({
    setUser: mockSetUser,
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

describe('AuthLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(<AuthLogin />);

    expect(screen.getByRole('heading', { name: /prijavi se/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tvoj.email@primer.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('renders login button', () => {
    render(<AuthLogin />);

    expect(screen.getByRole('button', { name: /prijavi se/i })).toBeInTheDocument();
  });

  it('renders social login options', () => {
    render(<AuthLogin />);

    expect(screen.getByText(/ili nastavi sa/i)).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    render(<AuthLogin />);

    expect(screen.getByText('Zaboravio si lozinku?')).toBeInTheDocument();
  });

  it('renders registration link', () => {
    render(<AuthLogin />);

    expect(screen.getByText(/nemaš nalog/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /registruj se/i })).toBeInTheDocument();
  });

  it('renders back to home link', () => {
    render(<AuthLogin />);

    expect(screen.getByText(/nazad na početnu/i)).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    const { loginAction } = require('@/lib/auth');
    loginAction.mockResolvedValue({
      success: true,
      data: { user: { id: '1', email: 'test@example.com' } },
    });

    const user = userEvent.setup();
    render(<AuthLogin />);

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

  it('updates auth context and redirects on successful login', async () => {
    const { loginAction } = require('@/lib/auth');
    const mockUser = { id: '1', email: 'test@example.com' };
    loginAction.mockResolvedValue({
      success: true,
      data: { user: mockUser },
    });

    const user = userEvent.setup();
    render(<AuthLogin />);

    await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
    await user.click(screen.getByRole('button', { name: /prijavi se/i }));

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message on login failure', async () => {
    const { loginAction } = require('@/lib/auth');
    loginAction.mockResolvedValue({
      success: false,
      error: 'Invalid credentials',
    });

    const user = userEvent.setup();
    render(<AuthLogin />);

    await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /prijavi se/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('shows default error message when no error provided', async () => {
    const { loginAction } = require('@/lib/auth');
    loginAction.mockResolvedValue({
      success: false,
      error: null,
    });

    const user = userEvent.setup();
    render(<AuthLogin />);

    await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /prijavi se/i }));

    await waitFor(() => {
      expect(screen.getByText(/email ili lozinka nisu ispravni/i)).toBeInTheDocument();
    });
  });

  it('handles Google OAuth success', async () => {
    const { googleAuthAction } = require('@/lib/auth');
    const mockUser = { id: '1', email: 'google@example.com' };
    googleAuthAction.mockResolvedValue({
      success: true,
      data: { user: mockUser },
    });

    const user = userEvent.setup();
    render(<AuthLogin />);

    await user.click(screen.getByTestId('google-login'));

    await waitFor(() => {
      expect(googleAuthAction).toHaveBeenCalledWith('mock-google-token');
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('handles Google OAuth failure', async () => {
    const { googleAuthAction } = require('@/lib/auth');
    googleAuthAction.mockResolvedValue({
      success: false,
      error: 'Google auth failed',
    });

    const user = userEvent.setup();
    render(<AuthLogin />);

    await user.click(screen.getByTestId('google-login'));

    await waitFor(() => {
      expect(screen.getByText('Google auth failed')).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<AuthLogin />);

    const passwordInput = screen.getByPlaceholderText('••••••••');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find and click the visibility toggle button
    const toggleButtons = screen.getAllByRole('button');
    const eyeButton = toggleButtons.find(btn => btn.querySelector('svg'));

    if (eyeButton) {
      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  it('has remember me checkbox', () => {
    render(<AuthLogin />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Zapamti me')).toBeInTheDocument();
  });
});
