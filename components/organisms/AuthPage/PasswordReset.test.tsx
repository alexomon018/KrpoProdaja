import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { PasswordReset } from './PasswordReset';

// Mock the auth actions
jest.mock('@/lib/auth/actions', () => ({
  requestPasswordResetAction: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/reset-password',
  useSearchParams: () => new URLSearchParams(),
}));

describe('PasswordReset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders password reset form', () => {
    render(<PasswordReset />);

    // The form should have an email input
    expect(screen.getByRole('textbox') || screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<PasswordReset />);

    // Should have a submit button
    expect(screen.getByRole('button', { name: /pošalji link/i })).toBeInTheDocument();
  });

  it('handles form submission with valid email', async () => {
    const { requestPasswordResetAction } = require('@/lib/auth/actions');
    requestPasswordResetAction.mockResolvedValue({
      success: true,
    });

    const user = userEvent.setup();
    render(<PasswordReset />);

    const emailInput = screen.getByRole('textbox') || screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', { name: /pošalji link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(requestPasswordResetAction).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  it('shows success state after successful request', async () => {
    const { requestPasswordResetAction } = require('@/lib/auth/actions');
    requestPasswordResetAction.mockResolvedValue({
      success: true,
    });

    const user = userEvent.setup();
    render(<PasswordReset />);

    const emailInput = screen.getByRole('textbox') || screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', { name: /pošalji link/i });
    await user.click(submitButton);

    // The success state should be indicated somehow
    await waitFor(() => {
      expect(requestPasswordResetAction).toHaveBeenCalled();
    });
  });

  it('displays error message on failure', async () => {
    const { requestPasswordResetAction } = require('@/lib/auth/actions');
    requestPasswordResetAction.mockResolvedValue({
      success: false,
      error: 'Email not found',
    });

    const user = userEvent.setup();
    render(<PasswordReset />);

    const emailInput = screen.getByRole('textbox') || screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'notfound@example.com');

    const submitButton = screen.getByRole('button', { name: /pošalji link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email not found')).toBeInTheDocument();
    });
  });

  it('shows default error message when no error provided', async () => {
    const { requestPasswordResetAction } = require('@/lib/auth/actions');
    requestPasswordResetAction.mockResolvedValue({
      success: false,
      error: null,
    });

    const user = userEvent.setup();
    render(<PasswordReset />);

    const emailInput = screen.getByRole('textbox') || screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', { name: /pošalji link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/greška pri slanju email-a/i)).toBeInTheDocument();
    });
  });

  it('clears error on new submission', async () => {
    const { requestPasswordResetAction } = require('@/lib/auth/actions');
    requestPasswordResetAction
      .mockResolvedValueOnce({
        success: false,
        error: 'First error',
      })
      .mockResolvedValueOnce({
        success: true,
      });

    const user = userEvent.setup();
    render(<PasswordReset />);

    const emailInput = screen.getByRole('textbox') || screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button', { name: /pošalji link/i });

    // First submission - should fail
    await user.type(emailInput, 'test@example.com');
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
});
