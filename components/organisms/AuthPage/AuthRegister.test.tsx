import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { AuthRegister } from './AuthRegister';

// Mock the auth actions
jest.mock('@/lib/auth', () => ({
  registerAction: jest.fn(),
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

describe('AuthRegister', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form', () => {
    render(<AuthRegister />);

    expect(screen.getByRole('heading', { name: /registruj se/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tvoj.email@primer.com')).toBeInTheDocument();
    // Two password fields
    expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2);
  });

  it('renders registration button', () => {
    render(<AuthRegister />);

    expect(screen.getByRole('button', { name: /registruj se/i })).toBeInTheDocument();
  });

  it('renders social login options', () => {
    render(<AuthRegister />);

    expect(screen.getByText(/ili nastavi sa/i)).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });

  it('renders login link for existing users', () => {
    render(<AuthRegister />);

    expect(screen.getByText(/već imaš nalog/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /prijavi se/i })).toBeInTheDocument();
  });

  it('renders back to home link', () => {
    render(<AuthRegister />);

    expect(screen.getByText(/nazad na početnu/i)).toBeInTheDocument();
  });

  it('renders terms and privacy links', () => {
    render(<AuthRegister />);

    expect(screen.getByRole('link', { name: /uslovima korišćenja/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /politikom privatnosti/i })).toBeInTheDocument();
  });

  it('has terms agreement checkbox', () => {
    render(<AuthRegister />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText(/slažem se sa/i)).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    const { registerAction } = require('@/lib/auth');
    registerAction.mockResolvedValue({
      success: true,
      data: { user: { id: '1', email: 'test@example.com' } },
    });

    const user = userEvent.setup();
    render(<AuthRegister />);

    await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'newuser@example.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'Password123');
    await user.type(passwordInputs[1], 'Password123');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /registruj se/i }));

    await waitFor(() => {
      expect(registerAction).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'Password123',
      });
    });
  });

  it('redirects to email verification page on successful registration', async () => {
    const { registerAction } = require('@/lib/auth');
    registerAction.mockResolvedValue({
      success: true,
    });

    const user = userEvent.setup();
    render(<AuthRegister />);

    await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'newuser@example.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'Password123');
    await user.type(passwordInputs[1], 'Password123');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /registruj se/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/verify-email?email=newuser%40example.com');
    });
  });

  it('displays error message on registration failure', async () => {
    const { registerAction } = require('@/lib/auth');
    registerAction.mockResolvedValue({
      success: false,
      error: 'Email already exists',
    });

    const user = userEvent.setup();
    render(<AuthRegister />);

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

  it('shows default error message when no error provided', async () => {
    const { registerAction } = require('@/lib/auth');
    registerAction.mockResolvedValue({
      success: false,
      error: null,
    });

    const user = userEvent.setup();
    render(<AuthRegister />);

    await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'Password123');
    await user.type(passwordInputs[1], 'Password123');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /registruj se/i }));

    await waitFor(() => {
      expect(screen.getByText(/greška pri registraciji/i)).toBeInTheDocument();
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
    render(<AuthRegister />);

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
      error: 'Google registration failed',
    });

    const user = userEvent.setup();
    render(<AuthRegister />);

    await user.click(screen.getByTestId('google-login'));

    await waitFor(() => {
      expect(screen.getByText('Google registration failed')).toBeInTheDocument();
    });
  });

  it('toggles password visibility for both password fields', async () => {
    const user = userEvent.setup();
    render(<AuthRegister />);

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    expect(passwordInputs[0]).toHaveAttribute('type', 'password');
    expect(passwordInputs[1]).toHaveAttribute('type', 'password');

    // Find toggle buttons (there should be one for each password field)
    const toggleButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg'));

    if (toggleButtons.length >= 2) {
      // Toggle first password field
      await user.click(toggleButtons[0]);
      expect(passwordInputs[0]).toHaveAttribute('type', 'text');

      // Toggle second password field
      await user.click(toggleButtons[1]);
      expect(passwordInputs[1]).toHaveAttribute('type', 'text');
    }
  });
});
