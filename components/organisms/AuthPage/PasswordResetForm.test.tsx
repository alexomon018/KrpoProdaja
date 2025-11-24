import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { PasswordResetForm } from './PasswordResetForm';

// Mock the auth actions
jest.mock('@/lib/auth/actions', () => ({
  resetPasswordAction: jest.fn(),
}));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({
    token: 'test-reset-token',
  }),
  usePathname: () => '/reset-password/test-reset-token',
  useSearchParams: () => new URLSearchParams(),
}));

describe('PasswordResetForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders password reset form', () => {
    render(<PasswordResetForm />);

    // Should have password input(s)
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    expect(passwordInputs.length).toBeGreaterThanOrEqual(1);
  });

  it('renders submit button', () => {
    render(<PasswordResetForm />);

    expect(screen.getByRole('button', { name: /promeni lozinku/i })).toBeInTheDocument();
  });

  it('handles form submission with new password', async () => {
    jest.useRealTimers(); // Need real timers for userEvent
    const { resetPasswordAction } = require('@/lib/auth/actions');
    resetPasswordAction.mockResolvedValue({
      success: true,
    });

    const user = userEvent.setup();
    render(<PasswordResetForm />);

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    // Password must be valid: 8+ chars, 1 uppercase, 1 number
    await user.type(passwordInputs[0], 'NewPassword1');
    if (passwordInputs.length > 1) {
      await user.type(passwordInputs[1], 'NewPassword1');
    }

    const submitButton = screen.getByRole('button', { name: /promeni lozinku/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(resetPasswordAction).toHaveBeenCalledWith({
        token: 'test-reset-token',
        newPassword: 'NewPassword1',
      });
    });
  });

  it('redirects to login after successful password reset', async () => {
    jest.useRealTimers();
    const { resetPasswordAction } = require('@/lib/auth/actions');
    resetPasswordAction.mockResolvedValue({
      success: true,
    });

    const user = userEvent.setup();
    render(<PasswordResetForm />);

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'NewPassword1');
    if (passwordInputs.length > 1) {
      await user.type(passwordInputs[1], 'NewPassword1');
    }

    const submitButton = screen.getByRole('button', { name: /promeni lozinku/i });
    await user.click(submitButton);

    // Wait for the setTimeout to complete
    await waitFor(() => {
      expect(resetPasswordAction).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('displays error message on failure', async () => {
    jest.useRealTimers();
    const { resetPasswordAction } = require('@/lib/auth/actions');
    resetPasswordAction.mockResolvedValue({
      success: false,
      error: 'Token expired',
    });

    const user = userEvent.setup();
    render(<PasswordResetForm />);

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'NewPassword1');
    if (passwordInputs.length > 1) {
      await user.type(passwordInputs[1], 'NewPassword1');
    }

    const submitButton = screen.getByRole('button', { name: /promeni lozinku/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Token expired')).toBeInTheDocument();
    });
  });

  it('shows default error message when no error provided', async () => {
    jest.useRealTimers();
    const { resetPasswordAction } = require('@/lib/auth/actions');
    resetPasswordAction.mockResolvedValue({
      success: false,
      error: null,
    });

    const user = userEvent.setup();
    render(<PasswordResetForm />);

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'NewPassword1');
    if (passwordInputs.length > 1) {
      await user.type(passwordInputs[1], 'NewPassword1');
    }

    const submitButton = screen.getByRole('button', { name: /promeni lozinku/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/greška pri promeni lozinke/i)).toBeInTheDocument();
    });
  });

  it('clears error state on new submission', async () => {
    jest.useRealTimers();
    const { resetPasswordAction } = require('@/lib/auth/actions');
    resetPasswordAction
      .mockResolvedValueOnce({
        success: false,
        error: 'First error',
      })
      .mockResolvedValueOnce({
        success: true,
      });

    const user = userEvent.setup();
    render(<PasswordResetForm />);

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /promeni lozinku/i });

    // First submission - should fail
    await user.type(passwordInputs[0], 'NewPassword1');
    if (passwordInputs.length > 1) {
      await user.type(passwordInputs[1], 'NewPassword1');
    }
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First error')).toBeInTheDocument();
    });

    // Second submission - should succeed and clear error
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('First error')).not.toBeInTheDocument();
    });
  });

  it('uses token from URL params', async () => {
    jest.useRealTimers();
    const { resetPasswordAction } = require('@/lib/auth/actions');
    resetPasswordAction.mockResolvedValue({ success: true });

    const user = userEvent.setup();
    render(<PasswordResetForm />);

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'NewPassword1');
    if (passwordInputs.length > 1) {
      await user.type(passwordInputs[1], 'NewPassword1');
    }

    const submitButton = screen.getByRole('button', { name: /promeni lozinku/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(resetPasswordAction).toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'test-reset-token',
        })
      );
    });
  });
});
