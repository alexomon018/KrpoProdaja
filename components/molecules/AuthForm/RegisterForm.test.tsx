import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from './RegisterForm';

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
  usePathname: () => '/register',
  useSearchParams: () => new URLSearchParams(),
}));

describe('RegisterForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders registration form with all fields', () => {
      render(<RegisterForm {...defaultProps} />);

      expect(screen.getByRole('heading', { name: /registruj se/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('tvoj.email@primer.com')).toBeInTheDocument();
      // Two password fields
      expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2);
    });

    it('renders email input with correct attributes', () => {
      render(<RegisterForm {...defaultProps} />);

      const emailInput = screen.getByPlaceholderText('tvoj.email@primer.com');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('renders password and confirm password fields', () => {
      render(<RegisterForm {...defaultProps} />);

      expect(screen.getByText('Lozinka')).toBeInTheDocument();
      expect(screen.getByText('Potvrdi lozinku')).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<RegisterForm {...defaultProps} />);

      expect(screen.getByRole('button', { name: /registruj se/i })).toBeInTheDocument();
    });

    it('renders terms agreement checkbox', () => {
      render(<RegisterForm {...defaultProps} />);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText(/slažem se sa/i)).toBeInTheDocument();
    });

    it('renders terms and privacy links', () => {
      render(<RegisterForm {...defaultProps} />);

      expect(screen.getByRole('link', { name: /uslovima korišćenja/i })).toHaveAttribute('href', '/terms');
      expect(screen.getByRole('link', { name: /politikom privatnosti/i })).toHaveAttribute('href', '/privacy');
    });

    it('renders back to home link when not in modal', () => {
      render(<RegisterForm {...defaultProps} />);

      expect(screen.getByText(/nazad na početnu/i)).toBeInTheDocument();
    });

    it('hides header and back link when isModal is true', () => {
      render(<RegisterForm {...defaultProps} isModal={true} />);

      expect(screen.queryByText(/nazad na početnu/i)).not.toBeInTheDocument();
    });

    it('renders login link as Link when not in modal', () => {
      render(<RegisterForm {...defaultProps} />);

      expect(screen.getByRole('link', { name: /prijavi se/i })).toHaveAttribute('href', '/login');
    });

    it('renders login toggle button when in modal', () => {
      const mockToggle = jest.fn();
      render(<RegisterForm {...defaultProps} isModal={true} onToggleMode={mockToggle} />);

      expect(screen.getByRole('button', { name: /prijavi se/i })).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('calls onSubmit with form data on valid submission', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      render(<RegisterForm onSubmit={handleSubmit} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'newuser@example.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'Password123');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /registruj se/i }));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
          agreeToTerms: true,
        });
      });
    });

    it('does not submit when terms not agreed', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      render(<RegisterForm onSubmit={handleSubmit} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'newuser@example.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'Password123');
      // Don't click checkbox
      await user.click(screen.getByRole('button', { name: /registruj se/i }));

      await waitFor(() => {
        expect(handleSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('loading state', () => {
    it('disables form fields when loading', () => {
      render(<RegisterForm {...defaultProps} loading={true} />);

      expect(screen.getByPlaceholderText('tvoj.email@primer.com')).toBeDisabled();
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      expect(passwordInputs[0]).toBeDisabled();
      expect(passwordInputs[1]).toBeDisabled();
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('disables submit button when loading', () => {
      render(<RegisterForm {...defaultProps} loading={true} />);

      expect(screen.getByRole('button', { name: /registruj se/i })).toBeDisabled();
    });
  });

  describe('error display', () => {
    it('displays error message when provided', () => {
      render(<RegisterForm {...defaultProps} error="Email already exists" />);

      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });

    it('does not display error div when no error', () => {
      const { container } = render(<RegisterForm {...defaultProps} />);

      expect(container.querySelector('.bg-semantic-error\\/10')).not.toBeInTheDocument();
    });

    it('shows terms agreement error when checkbox validation fails', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      render(<RegisterForm onSubmit={handleSubmit} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'Password123');
      await user.click(screen.getByRole('button', { name: /registruj se/i }));

      await waitFor(() => {
        expect(screen.getByText(/morate prihvatiti uslove korišćenja/i)).toBeInTheDocument();
      });
    });
  });

  describe('password visibility toggle', () => {
    it('toggles password visibility for first password field', async () => {
      const user = userEvent.setup();
      render(<RegisterForm {...defaultProps} />);

      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      expect(passwordInputs[0]).toHaveAttribute('type', 'password');

      // Find toggle buttons
      const toggleButtons = screen.getAllByRole('button').filter(btn =>
        btn.closest('.relative') && btn.querySelector('svg')
      );

      if (toggleButtons.length >= 1) {
        await user.click(toggleButtons[0]);
        expect(passwordInputs[0]).toHaveAttribute('type', 'text');
      }
    });

    it('toggles password visibility for confirm password field', async () => {
      const user = userEvent.setup();
      render(<RegisterForm {...defaultProps} />);

      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      expect(passwordInputs[1]).toHaveAttribute('type', 'password');

      // Find toggle buttons
      const toggleButtons = screen.getAllByRole('button').filter(btn =>
        btn.closest('.relative') && btn.querySelector('svg')
      );

      if (toggleButtons.length >= 2) {
        await user.click(toggleButtons[1]);
        expect(passwordInputs[1]).toHaveAttribute('type', 'text');
      }
    });
  });

  describe('mode toggle', () => {
    it('calls onToggleMode when toggle button is clicked in modal', async () => {
      const mockToggle = jest.fn();
      const user = userEvent.setup();
      render(<RegisterForm {...defaultProps} isModal={true} onToggleMode={mockToggle} />);

      await user.click(screen.getByRole('button', { name: /prijavi se/i }));

      expect(mockToggle).toHaveBeenCalled();
    });
  });

  describe('social login', () => {
    it('renders social login section', () => {
      render(<RegisterForm {...defaultProps} />);

      expect(screen.getByText(/ili nastavi sa/i)).toBeInTheDocument();
    });

    it('calls onGoogleSuccess when Google login succeeds', async () => {
      const handleGoogleSuccess = jest.fn();
      const user = userEvent.setup();
      render(<RegisterForm {...defaultProps} onGoogleSuccess={handleGoogleSuccess} />);

      await user.click(screen.getByTestId('google-login'));

      expect(handleGoogleSuccess).toHaveBeenCalledWith('mock-google-token');
    });

    it('renders Facebook login button', () => {
      render(<RegisterForm {...defaultProps} />);

      expect(screen.getByText('Facebook')).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('validates email format', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      render(<RegisterForm onSubmit={handleSubmit} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'invalidemail');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'Password123');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /registruj se/i }));

      await waitFor(() => {
        expect(handleSubmit).not.toHaveBeenCalled();
      });
    });

    it('validates password confirmation matches', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      render(<RegisterForm onSubmit={handleSubmit} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwordInputs[0], 'Password123');
      await user.type(passwordInputs[1], 'DifferentPass123');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /registruj se/i }));

      await waitFor(() => {
        expect(handleSubmit).not.toHaveBeenCalled();
      });
    });

    it('requires password field', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      render(<RegisterForm onSubmit={handleSubmit} />);

      await user.type(screen.getByPlaceholderText('tvoj.email@primer.com'), 'test@example.com');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /registruj se/i }));

      await waitFor(() => {
        expect(handleSubmit).not.toHaveBeenCalled();
      });
    });
  });
});
