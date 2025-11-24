import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

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

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/login',
  useSearchParams: () => new URLSearchParams(),
}));

describe('LoginForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders login form with all fields', () => {
      render(<LoginForm {...defaultProps} />);

      expect(screen.getByRole('heading', { name: /prijavi se/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('tvoj.email@primer.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('renders email input with correct attributes', () => {
      render(<LoginForm {...defaultProps} />);

      const emailInput = screen.getByPlaceholderText('tvoj.email@primer.com');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('renders password input with password type', () => {
      render(<LoginForm {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('renders submit button', () => {
      render(<LoginForm {...defaultProps} />);

      expect(screen.getByRole('button', { name: /prijavi se/i })).toBeInTheDocument();
    });

    it('renders remember me checkbox', () => {
      render(<LoginForm {...defaultProps} />);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Zapamti me')).toBeInTheDocument();
    });

    it('renders forgot password link', () => {
      render(<LoginForm {...defaultProps} />);

      expect(screen.getByText('Zaboravio si lozinku?')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /zaboravio si lozinku/i })).toHaveAttribute('href', '/reset-password');
    });

    it('renders back to home link when not in modal', () => {
      render(<LoginForm {...defaultProps} />);

      expect(screen.getByText(/nazad na početnu/i)).toBeInTheDocument();
    });

    it('hides header and back link when isModal is true', () => {
      render(<LoginForm {...defaultProps} isModal={true} />);

      expect(screen.queryByText(/nazad na početnu/i)).not.toBeInTheDocument();
      expect(screen.queryByText('Dobrodošli nazad!')).not.toBeInTheDocument();
    });

    it('renders registration link as Link when not in modal', () => {
      render(<LoginForm {...defaultProps} />);

      expect(screen.getByRole('link', { name: /registruj se/i })).toHaveAttribute('href', '/register');
    });

    it('renders registration toggle button when in modal', () => {
      const mockToggle = jest.fn();
      render(<LoginForm {...defaultProps} isModal={true} onToggleMode={mockToggle} />);

      expect(screen.getByRole('button', { name: /registruj se/i })).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('calls onSubmit with form data on valid submission', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      render(<LoginForm onSubmit={handleSubmit} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /prijavi se/i }));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false,
        });
      });
    });

    it('includes rememberMe when checked', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      render(<LoginForm onSubmit={handleSubmit} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /prijavi se/i }));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            rememberMe: true,
          })
        );
      });
    });
  });

  describe('loading state', () => {
    it('disables form fields when loading', () => {
      render(<LoginForm {...defaultProps} loading={true} />);

      expect(screen.getByPlaceholderText('tvoj.email@primer.com')).toBeDisabled();
      expect(screen.getByPlaceholderText('••••••••')).toBeDisabled();
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('disables submit button when loading', () => {
      render(<LoginForm {...defaultProps} loading={true} />);

      expect(screen.getByRole('button', { name: /prijavi se/i })).toBeDisabled();
    });
  });

  describe('error display', () => {
    it('displays error message when provided', () => {
      render(<LoginForm {...defaultProps} error="Invalid credentials" />);

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('does not display error div when no error', () => {
      const { container } = render(<LoginForm {...defaultProps} />);

      expect(container.querySelector('.bg-semantic-error\\/10')).not.toBeInTheDocument();
    });
  });

  describe('password visibility toggle', () => {
    it('toggles password visibility when eye icon is clicked', async () => {
      const user = userEvent.setup();
      render(<LoginForm {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Find the visibility toggle button (the one inside the password field container)
      const toggleButtons = screen.getAllByRole('button');
      const toggleButton = toggleButtons.find(btn =>
        btn.closest('.relative') && btn.querySelector('svg')
      );

      if (toggleButton) {
        await user.click(toggleButton);
        expect(passwordInput).toHaveAttribute('type', 'text');

        await user.click(toggleButton);
        expect(passwordInput).toHaveAttribute('type', 'password');
      }
    });
  });

  describe('mode toggle', () => {
    it('calls onToggleMode when toggle button is clicked in modal', async () => {
      const mockToggle = jest.fn();
      const user = userEvent.setup();
      render(<LoginForm {...defaultProps} isModal={true} onToggleMode={mockToggle} />);

      await user.click(screen.getByRole('button', { name: /registruj se/i }));

      expect(mockToggle).toHaveBeenCalled();
    });
  });

  describe('social login', () => {
    it('renders social login section', () => {
      render(<LoginForm {...defaultProps} />);

      expect(screen.getByText(/ili nastavi sa/i)).toBeInTheDocument();
    });

    it('calls onGoogleSuccess when Google login succeeds', async () => {
      const handleGoogleSuccess = jest.fn();
      const user = userEvent.setup();
      render(<LoginForm {...defaultProps} onGoogleSuccess={handleGoogleSuccess} />);

      await user.click(screen.getByTestId('google-login'));

      expect(handleGoogleSuccess).toHaveBeenCalledWith('mock-google-token');
    });

    it('renders Facebook login button', () => {
      render(<LoginForm {...defaultProps} />);

      expect(screen.getByText('Facebook')).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('validates email format', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      render(<LoginForm onSubmit={handleSubmit} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'invalidemail');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /prijavi se/i }));

      // Form should not submit with invalid email
      await waitFor(() => {
        expect(handleSubmit).not.toHaveBeenCalled();
      });
    });

    it('requires password field', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      render(<LoginForm onSubmit={handleSubmit} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      // Don't fill password
      await user.click(screen.getByRole('button', { name: /prijavi se/i }));

      // Form should not submit without password
      await waitFor(() => {
        expect(handleSubmit).not.toHaveBeenCalled();
      });
    });
  });
});
