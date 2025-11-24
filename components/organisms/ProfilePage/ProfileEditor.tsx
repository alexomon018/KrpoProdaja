"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useUpdateCurrentUser } from "@/lib/api/hooks";
import {
  ProfileEditForm,
  ProfileFormData,
} from "@/components/molecules/AuthForm/ProfileEditForm";
import { PhoneVerificationModal } from "@/components/molecules/PhoneVerificationModal";
import { Container } from "@/components/atoms/Container/Container";
import { Typography } from "@/components/atoms/Typography/Typography";
import type { UpdateUserRequest } from "@/lib/api/types";

// TODO: Implement avatar upload functionality when backend supports it
const uploadAvatar = async (file: File): Promise<string> => {
  console.log("Avatar upload - TODO: Implement when backend supports it", file);
  return URL.createObjectURL(file);
};

const removeAvatar = async (): Promise<void> => {
  console.log("Avatar removal - TODO: Implement when backend supports it");
};

export function ProfileEditor() {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState<string>("");

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

  // Transform form data to API request format
  const transformFormData = (formData: ProfileFormData): UpdateUserRequest => {
    // Split name into firstName and lastName
    const nameParts = formData.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

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

  // Prepare initial data from current user
  const initialData: Partial<ProfileFormData> | undefined = currentUser
    ? {
        name:
          currentUser.name ||
          `${currentUser.firstName || ""} ${
            currentUser.lastName || ""
          }`.trim() ||
          currentUser.email ||
          "",
        email: currentUser.email,
        phone: currentUser.phone || currentUser.phoneNumber || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
      }
    : undefined;

  // Check if phone number has changed and needs verification
  const isPhoneChanged = (newPhone?: string): boolean => {
    const currentPhone = currentUser?.phone || currentUser?.phoneNumber || "";
    const trimmedNew = (newPhone || "").trim();
    return trimmedNew !== "" && trimmedNew !== currentPhone;
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
            router.push("/profile");
          }, 1500);
        }
      },
    });
  };

  const handlePhoneVerified = () => {
    // Refresh user data to get updated verification status
    refreshUser?.();
    setTimeout(() => {
      router.push("/profile");
    }, 1500);
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const url = await uploadAvatar(file);
      setAvatarUrl(url);
    } catch (error) {
      console.error("Avatar upload failed:", error);
    }
  };

  const handleAvatarRemove = async () => {
    try {
      await removeAvatar();
      setAvatarUrl(undefined);
    } catch (error) {
      console.error("Avatar removal failed:", error);
    }
  };

  // Combine loading states
  const loading = isLoadingUser || updateProfileMutation.isPending;
  const success = updateProfileMutation.isSuccess;
  const error = updateProfileMutation.error?.message;

  return (
    <Container className="py-8">
      <div className="mb-8">
        <Typography variant="h1" className="text-center">
          Izmeni profil
        </Typography>
        <Typography variant="body" className="text-center text-secondary mt-2">
          Ažuriraj svoje informacije i podešavanja
        </Typography>
      </div>

      <ProfileEditForm
        initialData={initialData}
        currentAvatar={avatarUrl}
        onSubmit={handleSubmit}
        onAvatarUpload={handleAvatarUpload}
        onAvatarRemove={handleAvatarRemove}
        loading={loading}
        error={error}
        success={success}
        isPhoneVerified={currentUser?.verifiedSeller ?? false}
      />

      <PhoneVerificationModal
        open={showPhoneVerification}
        onOpenChange={setShowPhoneVerification}
        phoneNumber={pendingPhoneNumber}
        onVerified={handlePhoneVerified}
      />
    </Container>
  );
}
