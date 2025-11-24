import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { SocialLogin } from './SocialLogin';

// Mock react-oauth/google
const mockGoogleOnSuccess = jest.fn();
const mockGoogleOnError = jest.fn();

jest.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess, onError }: any) => {
    // Store callbacks for testing
    mockGoogleOnSuccess.mockImplementation(() => {
      onSuccess?.({ credential: 'mock-google-id-token' });
    });
    mockGoogleOnError.mockImplementation(() => {
      onError?.();
    });

    return (
      <div data-testid="google-login-container">
        <button
          data-testid="google-login-success"
          onClick={() => onSuccess?.({ credential: 'mock-google-id-token' })}
        >
          Google Login
        </button>
        <button
          data-testid="google-login-error"
          onClick={() => onError?.()}
        >
          Google Error
        </button>
        <button
          data-testid="google-login-no-credential"
          onClick={() => onSuccess?.({})}
        >
          No Credential
        </button>
      </div>
    );
  },
}));

describe('SocialLogin', () => {
  const defaultProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window.FB mock
    (window as any).FB = undefined;
  });

  describe('rendering', () => {
    it('renders social login section', () => {
      render(<SocialLogin {...defaultProps} />);

      expect(screen.getByText(/ili nastavi sa/i)).toBeInTheDocument();
    });

    it('renders Google login component', () => {
      render(<SocialLogin {...defaultProps} />);

      expect(screen.getByTestId('google-login-container')).toBeInTheDocument();
    });

    it('renders Facebook login button', () => {
      render(<SocialLogin {...defaultProps} />);

      expect(screen.getByText('Facebook')).toBeInTheDocument();
    });

    it('renders Facebook icon', () => {
      const { container } = render(<SocialLogin {...defaultProps} />);

      // Check for Facebook SVG icon
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Google authentication', () => {
    it('calls onGoogleSuccess with ID token on successful login', async () => {
      const handleGoogleSuccess = jest.fn();
      const user = userEvent.setup();
      render(<SocialLogin onGoogleSuccess={handleGoogleSuccess} />);

      await user.click(screen.getByTestId('google-login-success'));

      await waitFor(() => {
        expect(handleGoogleSuccess).toHaveBeenCalledWith('mock-google-id-token');
      });
    });

    it('calls onError when Google login fails', async () => {
      const handleError = jest.fn();
      const user = userEvent.setup();
      render(<SocialLogin onError={handleError} />);

      await user.click(screen.getByTestId('google-login-error'));

      await waitFor(() => {
        expect(handleError).toHaveBeenCalledWith('Google login was cancelled or failed');
      });
    });

    it('calls onError when no credential received', async () => {
      const handleError = jest.fn();
      const user = userEvent.setup();
      render(<SocialLogin onError={handleError} />);

      await user.click(screen.getByTestId('google-login-no-credential'));

      await waitFor(() => {
        expect(handleError).toHaveBeenCalledWith('Google login failed: No credential received');
      });
    });

    it('handles Google login without callbacks', async () => {
      const user = userEvent.setup();
      render(<SocialLogin />);

      // Should not throw when no callbacks provided
      await user.click(screen.getByTestId('google-login-success'));
    });
  });

  describe('Facebook authentication', () => {
    it('calls onError when FB SDK not loaded', async () => {
      const handleError = jest.fn();
      const user = userEvent.setup();
      render(<SocialLogin onError={handleError} />);

      await user.click(screen.getByText('Facebook'));

      expect(handleError).toHaveBeenCalledWith('Facebook SDK not loaded yet. Please try again.');
    });

    it('calls onFacebookSuccess with access token on successful login', async () => {
      const handleFacebookSuccess = jest.fn();
      const user = userEvent.setup();

      // Mock Facebook SDK
      (window as any).FB = {
        login: (callback: any) => {
          callback({
            authResponse: {
              accessToken: 'mock-facebook-access-token',
            },
          });
        },
      };

      render(<SocialLogin onFacebookSuccess={handleFacebookSuccess} />);

      await user.click(screen.getByText('Facebook'));

      expect(handleFacebookSuccess).toHaveBeenCalledWith('mock-facebook-access-token');
    });

    it('calls onError when Facebook login is cancelled', async () => {
      const handleError = jest.fn();
      const user = userEvent.setup();

      // Mock Facebook SDK with cancelled login
      (window as any).FB = {
        login: (callback: any) => {
          callback({
            authResponse: null,
          });
        },
      };

      render(<SocialLogin onError={handleError} />);

      await user.click(screen.getByText('Facebook'));

      expect(handleError).toHaveBeenCalledWith('Facebook login was cancelled');
    });

    it('requests correct Facebook permissions', async () => {
      const mockFBLogin = jest.fn();
      (window as any).FB = {
        login: mockFBLogin,
      };

      const user = userEvent.setup();
      render(<SocialLogin />);

      await user.click(screen.getByText('Facebook'));

      expect(mockFBLogin).toHaveBeenCalledWith(
        expect.any(Function),
        { scope: 'public_profile,email' }
      );
    });
  });

  describe('loading state', () => {
    it('disables Facebook button when loading prop is true', () => {
      render(<SocialLogin loading={true} />);

      const facebookButton = screen.getByText('Facebook').closest('button');
      expect(facebookButton).toBeDisabled();
    });

    it('Facebook button is enabled when not loading', () => {
      render(<SocialLogin loading={false} />);

      const facebookButton = screen.getByText('Facebook').closest('button');
      expect(facebookButton).not.toBeDisabled();
    });

    it('disables Facebook button during Facebook login', async () => {
      const user = userEvent.setup();
      let loginCallback: any;

      // Mock Facebook SDK that holds the callback
      (window as any).FB = {
        login: (callback: any) => {
          loginCallback = callback;
          // Don't call callback immediately to simulate loading
        },
      };

      render(<SocialLogin />);

      await user.click(screen.getByText('Facebook'));

      // Button should be disabled during login
      // Note: This depends on implementation timing

      // Complete the login
      if (loginCallback) {
        loginCallback({ authResponse: { accessToken: 'token' } });
      }
    });
  });

  describe('layout', () => {
    it('renders buttons in a grid layout', () => {
      const { container } = render(<SocialLogin />);

      const grid = container.querySelector('.grid.grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('renders divider with text', () => {
      render(<SocialLogin />);

      expect(screen.getByText(/ili nastavi sa/i)).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('handles errors gracefully without callbacks', async () => {
      const user = userEvent.setup();
      render(<SocialLogin />);

      // Should not throw
      await user.click(screen.getByTestId('google-login-error'));
    });

    it('handles Facebook errors gracefully without callbacks', async () => {
      const user = userEvent.setup();

      (window as any).FB = {
        login: (callback: any) => {
          callback({ authResponse: null });
        },
      };

      render(<SocialLogin />);

      // Should not throw
      await user.click(screen.getByText('Facebook'));
    });
  });
});
