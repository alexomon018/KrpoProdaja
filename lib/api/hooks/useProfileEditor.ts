/**
 * useProfileEditor Hook
 * Custom hook for managing profile editing with avatar upload, phone verification, and form state
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useUpdateCurrentUser } from './useUsers';
import type { UpdateUserRequest } from '../types';
import type { ProfileFormData } from '@/components/molecules/AuthForm/ProfileEditForm';

// TODO: Implement avatar upload functionality when backend supports it
const uploadAvatar = async (file: File): Promise<string> => {
  console.log('Avatar upload - TODO: Implement when backend supports it', file);
  return URL.createObjectURL(file);
};

const removeAvatar = async (): Promise<void> => {
  console.log('Avatar removal - TODO: Implement when backend supports it');
};

// Transform form data to API request format
const transformFormData = (formData: ProfileFormData): UpdateUserRequest => {
  // Split name into firstName and lastName
  const nameParts = formData.name.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    email: formData.email,
    firstName,
    lastName,
    // Note: These fields may not be supported by backend yet
    bio: formData.bio,
    location: formData.location,
    phoneNumber: formData.phone,
  };
};

export function useProfileEditor() {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState<string>('');

  // Get current user from auth context
  const authContext = useAuth();
  const currentUser = authContext?.user ?? null;
  const refreshUser = authContext?.refreshUser;
  const isLoadingUser = authContext?.isLoading ?? false;
  const updateProfileMutation = useUpdateCurrentUser();

  // Set initial avatar from user data
  useEffect(() => {
    if (currentUser?.avatar) {
      setAvatarUrl(currentUser.avatar);
    }
  }, [currentUser]);

  // Prepare initial data from current user
  const initialData: Partial<ProfileFormData> | undefined = useMemo(() => {
    if (!currentUser) return undefined;

    return {
      name:
        currentUser.name ||
        `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() ||
        currentUser.email ||
        '',
      email: currentUser.email,
      phone: currentUser.phone || currentUser.phoneNumber || '',
      bio: currentUser.bio || '',
      location: currentUser.location || '',
    };
  }, [currentUser]);

  // Check if phone number has changed and needs verification
  const isPhoneChanged = (newPhone?: string): boolean => {
    const currentPhone = currentUser?.phone || currentUser?.phoneNumber || '';
    const trimmedNew = (newPhone || '').trim();
    return trimmedNew !== '' && trimmedNew !== currentPhone;
  };

  const handleSubmit = (data: ProfileFormData) => {
    const apiData = transformFormData(data);
    const phoneChanged = isPhoneChanged(data.phone);

    updateProfileMutation.mutate(apiData, {
      onSuccess: () => {
        // If phone number changed, show verification modal
        if (phoneChanged && data.phone) {
          setPendingPhoneNumber(data.phone);
          setShowPhoneVerification(true);
        } else {
          setTimeout(() => {
            router.push('/profile');
          }, 1500);
        }
      },
    });
  };

  const handlePhoneVerified = () => {
    // Refresh user data to get updated verification status
    refreshUser?.();
    setTimeout(() => {
      router.push('/profile');
    }, 1500);
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const url = await uploadAvatar(file);
      setAvatarUrl(url);
    } catch (error) {
      console.error('Avatar upload failed:', error);
    }
  };

  const handleAvatarRemove = async () => {
    try {
      await removeAvatar();
      setAvatarUrl(undefined);
    } catch (error) {
      console.error('Avatar removal failed:', error);
    }
  };

  // Combine loading states
  const loading = isLoadingUser || updateProfileMutation.isPending;
  const success = updateProfileMutation.isSuccess;
  const error = updateProfileMutation.error?.message;
  const isPhoneVerified = currentUser?.verifiedSeller ?? false;

  return {
    // User data
    initialData,
    avatarUrl,
    isPhoneVerified,

    // Loading states
    loading,
    success,
    error,

    // Handlers
    handleSubmit,
    handleAvatarUpload,
    handleAvatarRemove,
    handlePhoneVerified,

    // Phone verification
    showPhoneVerification,
    setShowPhoneVerification,
    pendingPhoneNumber,
  };
}
