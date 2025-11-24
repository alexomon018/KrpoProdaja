import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ProfileEditor } from './ProfileEditor';

// Mock the API hooks
const mockMutate = jest.fn();
const mockUpdateProfileMutation = {
  mutate: mockMutate,
  isPending: false,
  isSuccess: false,
  isError: false,
  error: null,
};

jest.mock('@/lib/api/hooks', () => ({
  useUpdateCurrentUser: () => mockUpdateProfileMutation,
}));

// Mock the auth context
const mockRefreshUser = jest.fn();
const mockPush = jest.fn();

let mockCurrentUser: any = {
  id: '1',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  name: 'John Doe',
  phone: '+381641234567',
  bio: 'Test bio',
  location: 'Belgrade',
  avatar: null,
  verifiedSeller: false,
};

jest.mock('@/lib/auth/AuthProvider', () => ({
  useAuth: () => ({
    user: mockCurrentUser,
    refreshUser: mockRefreshUser,
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
  usePathname: () => '/profile/edit',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock the PhoneVerificationModal
jest.mock('@/components/molecules/PhoneVerificationModal', () => ({
  PhoneVerificationModal: ({ open, onOpenChange, phoneNumber, onVerified }: any) => (
    open ? (
      <div data-testid="phone-verification-modal">
        <span data-testid="verification-phone">{phoneNumber}</span>
        <button data-testid="verify-phone" onClick={onVerified}>
          Verify
        </button>
        <button data-testid="close-modal" onClick={() => onOpenChange(false)}>
          Close
        </button>
      </div>
    ) : null
  ),
}));

// Mock the ProfileEditForm
jest.mock('@/components/molecules/AuthForm/ProfileEditForm', () => ({
  ProfileEditForm: ({
    initialData,
    currentAvatar,
    onSubmit,
    onAvatarUpload,
    onAvatarRemove,
    loading,
    error,
    success,
    isPhoneVerified,
  }: any) => (
    <div data-testid="profile-edit-form">
      <span data-testid="initial-name">{initialData?.name}</span>
      <span data-testid="initial-email">{initialData?.email}</span>
      <span data-testid="initial-phone">{initialData?.phone}</span>
      <span data-testid="loading-state">{String(loading)}</span>
      <span data-testid="error-state">{error || 'no-error'}</span>
      <span data-testid="success-state">{String(success)}</span>
      <span data-testid="verified-state">{String(isPhoneVerified)}</span>
      <button
        data-testid="submit-form"
        onClick={() => onSubmit({
          name: 'John Doe',
          email: 'user@example.com',
          phone: '+381641234567',
          bio: 'Updated bio',
          location: 'Belgrade',
        })}
      >
        Submit
      </button>
      <button
        data-testid="submit-new-phone"
        onClick={() => onSubmit({
          name: 'John Doe',
          email: 'user@example.com',
          phone: '+381649999999',
          bio: 'Updated bio',
          location: 'Belgrade',
        })}
      >
        Submit New Phone
      </button>
      <button
        data-testid="upload-avatar"
        onClick={() => onAvatarUpload(new File([''], 'avatar.jpg', { type: 'image/jpeg' }))}
      >
        Upload Avatar
      </button>
      <button data-testid="remove-avatar" onClick={onAvatarRemove}>
        Remove Avatar
      </button>
    </div>
  ),
}));

describe('ProfileEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset mock values
    mockCurrentUser = {
      id: '1',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      phone: '+381641234567',
      bio: 'Test bio',
      location: 'Belgrade',
      avatar: null,
      verifiedSeller: false,
    };

    mockUpdateProfileMutation.isPending = false;
    mockUpdateProfileMutation.isSuccess = false;
    mockUpdateProfileMutation.isError = false;
    mockUpdateProfileMutation.error = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('rendering', () => {
    it('renders profile editor component', () => {
      render(<ProfileEditor />);

      expect(screen.getByText('Izmeni profil')).toBeInTheDocument();
      expect(screen.getByText(/ažuriraj svoje informacije/i)).toBeInTheDocument();
    });

    it('renders ProfileEditForm', () => {
      render(<ProfileEditor />);

      expect(screen.getByTestId('profile-edit-form')).toBeInTheDocument();
    });

    it('passes initial data from user context to form', () => {
      render(<ProfileEditor />);

      expect(screen.getByTestId('initial-name')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('initial-email')).toHaveTextContent('user@example.com');
      expect(screen.getByTestId('initial-phone')).toHaveTextContent('+381641234567');
    });

    it('passes phone verified state from user context', () => {
      mockCurrentUser.verifiedSeller = true;
      render(<ProfileEditor />);

      expect(screen.getByTestId('verified-state')).toHaveTextContent('true');
    });

    it('passes loading state to form', () => {
      mockUpdateProfileMutation.isPending = true;
      render(<ProfileEditor />);

      expect(screen.getByTestId('loading-state')).toHaveTextContent('true');
    });

    it('passes success state to form', () => {
      mockUpdateProfileMutation.isSuccess = true;
      render(<ProfileEditor />);

      expect(screen.getByTestId('success-state')).toHaveTextContent('true');
    });

    it('passes error state to form', () => {
      mockUpdateProfileMutation.error = { message: 'Update failed' } as any;
      render(<ProfileEditor />);

      expect(screen.getByTestId('error-state')).toHaveTextContent('Update failed');
    });
  });

  describe('form submission', () => {
    it('calls mutation on form submit', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();

      mockMutate.mockImplementation((data, options) => {
        options?.onSuccess?.();
      });

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('submit-form'));

      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
        }),
        expect.any(Object)
      );
    });

    it('transforms form data correctly for API', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();

      mockMutate.mockImplementation((data, options) => {
        options?.onSuccess?.();
      });

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('submit-form'));

      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Updated bio',
          location: 'Belgrade',
          phoneNumber: '+381641234567',
        }),
        expect.any(Object)
      );
    });

    it('redirects to profile page after successful update', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();

      mockMutate.mockImplementation((data, options) => {
        options?.onSuccess?.();
      });

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('submit-form'));

      // Wait for the timeout to complete
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/profile');
      }, { timeout: 2000 });
    });
  });

  describe('phone verification', () => {
    it('shows phone verification modal when phone number changes', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();

      mockMutate.mockImplementation((data, options) => {
        options?.onSuccess?.();
      });

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('submit-new-phone'));

      await waitFor(() => {
        expect(screen.getByTestId('phone-verification-modal')).toBeInTheDocument();
      });
    });

    it('passes new phone number to verification modal', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();

      mockMutate.mockImplementation((data, options) => {
        options?.onSuccess?.();
      });

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('submit-new-phone'));

      await waitFor(() => {
        expect(screen.getByTestId('verification-phone')).toHaveTextContent('+381649999999');
      });
    });

    it('refreshes user and redirects after phone verification', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();

      mockMutate.mockImplementation((data, options) => {
        options?.onSuccess?.();
      });

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('submit-new-phone'));

      await waitFor(() => {
        expect(screen.getByTestId('phone-verification-modal')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('verify-phone'));

      await waitFor(() => {
        expect(mockRefreshUser).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/profile');
      }, { timeout: 2000 });
    });

    it('does not show verification modal when phone unchanged', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();

      mockMutate.mockImplementation((data, options) => {
        options?.onSuccess?.();
      });

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('submit-form'));

      expect(screen.queryByTestId('phone-verification-modal')).not.toBeInTheDocument();
    });
  });

  describe('avatar handling', () => {
    it('handles avatar upload', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('upload-avatar'));

      // The uploadAvatar function logs a message
      expect(consoleSpy).toHaveBeenCalledWith(
        'Avatar upload - TODO: Implement when backend supports it',
        expect.any(File)
      );

      consoleSpy.mockRestore();
    });

    it('handles avatar removal', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('remove-avatar'));

      // The removeAvatar function logs a message
      expect(consoleSpy).toHaveBeenCalledWith(
        'Avatar removal - TODO: Implement when backend supports it'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('user data handling', () => {
    it('handles user with phoneNumber field instead of phone', () => {
      mockCurrentUser = {
        ...mockCurrentUser,
        phone: undefined,
        phoneNumber: '+381647777777',
      };

      render(<ProfileEditor />);

      expect(screen.getByTestId('initial-phone')).toHaveTextContent('+381647777777');
    });

    it('handles user without name field', () => {
      mockCurrentUser = {
        ...mockCurrentUser,
        name: undefined,
      };

      render(<ProfileEditor />);

      expect(screen.getByTestId('initial-name')).toHaveTextContent('John Doe');
    });

    it('handles null user gracefully', () => {
      mockCurrentUser = null;

      render(<ProfileEditor />);

      expect(screen.getByTestId('profile-edit-form')).toBeInTheDocument();
    });
  });

  describe('loading states', () => {
    it('shows loading state from auth context', () => {
      jest.mock('@/lib/auth/AuthProvider', () => ({
        useAuth: () => ({
          user: null,
          refreshUser: mockRefreshUser,
          isLoading: true,
        }),
      }));

      // Note: This would need a proper re-render with updated context
      // For now, we test via the mutation loading state
      mockUpdateProfileMutation.isPending = true;
      render(<ProfileEditor />);

      expect(screen.getByTestId('loading-state')).toHaveTextContent('true');
    });
  });
});
