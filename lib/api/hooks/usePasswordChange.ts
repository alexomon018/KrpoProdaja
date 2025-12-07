/**
 * usePasswordChange Hook
 * Custom hook for managing password change functionality
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChangePassword } from './useUsers';
import type { ChangePasswordRequest } from '../types';

export function usePasswordChange() {
  const router = useRouter();
  const changePasswordMutation = useChangePassword();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (data: ChangePasswordRequest) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      },
    });
  };

  return {
    // Handlers
    handleSubmit,

    // State
    isLoading: changePasswordMutation.isPending,
    error: changePasswordMutation.error?.message,
    showSuccess,
  };
}
