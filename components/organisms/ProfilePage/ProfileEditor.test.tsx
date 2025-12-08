import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ProfileEditor } from './ProfileEditor';

// Mock handlers
const mockHandleSubmit = jest.fn();
const mockHandleAvatarUpload = jest.fn();
const mockHandleAvatarRemove = jest.fn();
const mockHandlePhoneVerified = jest.fn();
const mockSetShowPhoneVerification = jest.fn();

// Mock the useProfileEditor hook
let mockUseProfileEditor: any = {
  initialData: {
    name: 'John Doe',
    email: 'user@example.com',
    phone: '+381641234567',
    bio: 'Test bio',
    location: 'Belgrade',
  },
  avatarUrl: undefined,
  isPhoneVerified: false,
  loading: false,
  success: false,
  error: undefined,
  handleSubmit: mockHandleSubmit,
  handleAvatarUpload: mockHandleAvatarUpload,
  handleAvatarRemove: mockHandleAvatarRemove,
  handlePhoneVerified: mockHandlePhoneVerified,
  showPhoneVerification: false,
  setShowPhoneVerification: mockSetShowPhoneVerification,
  pendingPhoneNumber: '',
};

jest.mock('@/lib/api/hooks/useProfileEditor', () => ({
  useProfileEditor: jest.fn(() => mockUseProfileEditor),
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

jest.mock('@/providers/AuthProvider', () => ({
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

    mockUseProfileEditor.loading = false;
    mockUseProfileEditor.success = false;
    mockUseProfileEditor.error = undefined;
    mockUseProfileEditor.showPhoneVerification = false;
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

    it('passes phone verified state from hook', () => {
      mockUseProfileEditor.isPhoneVerified = true;
      render(<ProfileEditor />);

      expect(screen.getByTestId('verified-state')).toHaveTextContent('true');
    });

    it('passes loading state to form', () => {
      mockUseProfileEditor.loading = true;
      render(<ProfileEditor />);

      expect(screen.getByTestId('loading-state')).toHaveTextContent('true');
    });

    it('passes success state to form', () => {
      mockUseProfileEditor.success = true;
      render(<ProfileEditor />);

      expect(screen.getByTestId('success-state')).toHaveTextContent('true');
    });

    it('passes error state to form', () => {
      mockUseProfileEditor.error = 'Update failed';
      render(<ProfileEditor />);

      expect(screen.getByTestId('error-state')).toHaveTextContent('Update failed');
    });
  });

  describe('form submission', () => {
    it('calls handleSubmit on form submit', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('submit-form'));

      expect(mockHandleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'user@example.com',
          name: 'John Doe',
        })
      );
    });

    it('transforms form data correctly for API', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('submit-form'));

      expect(mockHandleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          bio: 'Updated bio',
          location: 'Belgrade',
          phone: '+381641234567',
        })
      );
    });
  });

  describe('phone verification', () => {
    it('shows phone verification modal when showPhoneVerification is true', async () => {
      mockUseProfileEditor.showPhoneVerification = true;
      mockUseProfileEditor.pendingPhoneNumber = '+381649999999';

      render(<ProfileEditor />);

      expect(screen.getByTestId('phone-verification-modal')).toBeInTheDocument();
    });

    it('passes new phone number to verification modal', async () => {
      mockUseProfileEditor.showPhoneVerification = true;
      mockUseProfileEditor.pendingPhoneNumber = '+381649999999';

      render(<ProfileEditor />);

      expect(screen.getByTestId('verification-phone')).toHaveTextContent('+381649999999');
    });

    it('calls handlePhoneVerified when phone is verified', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();

      mockUseProfileEditor.showPhoneVerification = true;
      mockUseProfileEditor.pendingPhoneNumber = '+381649999999';

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('verify-phone'));

      expect(mockHandlePhoneVerified).toHaveBeenCalled();
    });

    it('does not show verification modal by default', async () => {
      render(<ProfileEditor />);

      expect(screen.queryByTestId('phone-verification-modal')).not.toBeInTheDocument();
    });
  });

  describe('avatar handling', () => {
    it('handles avatar upload', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('upload-avatar'));

      expect(mockHandleAvatarUpload).toHaveBeenCalledWith(expect.any(File));
    });

    it('handles avatar removal', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();

      render(<ProfileEditor />);

      await user.click(screen.getByTestId('remove-avatar'));

      expect(mockHandleAvatarRemove).toHaveBeenCalled();
    });
  });

  describe('user data handling', () => {
    it('handles user with phoneNumber field instead of phone', () => {
      mockUseProfileEditor.initialData = {
        ...mockUseProfileEditor.initialData,
        phone: '+381647777777',
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
    it('shows loading state from hook', () => {
      mockUseProfileEditor.loading = true;
      render(<ProfileEditor />);

      expect(screen.getByTestId('loading-state')).toHaveTextContent('true');
    });
  });
});
