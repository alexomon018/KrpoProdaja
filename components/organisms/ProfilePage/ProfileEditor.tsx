"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ProfileEditForm, ProfileFormData } from "@/components/molecules/AuthForm/ProfileEditForm";
import { Container } from "@/components/atoms/Container/Container";
import { Typography } from "@/components/atoms/Typography/Typography";

// TODO: Replace with actual API calls
const updateProfile = async (data: ProfileFormData): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Profile update data:", data);
};

const uploadAvatar = async (file: File): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Uploading avatar:", file);
  return URL.createObjectURL(file);
};

const removeAvatar = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Removing avatar");
};

export function ProfileEditor() {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string>();

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (url) => {
      setAvatarUrl(url);
    },
  });

  const removeAvatarMutation = useMutation({
    mutationFn: removeAvatar,
    onSuccess: () => {
      setAvatarUrl(undefined);
    },
  });

  // Mock initial data - TODO: fetch from backend
  const initialData: Partial<ProfileFormData> = {
    name: "Marko Marković",
    email: "marko@example.com",
    phone: "+381 60 123 4567",
    bio: "Ljubitelj tehnologije i dobrih kupovina. Prodajem kvalitetne polovne stvari.",
    location: "Beograd, Srbija",
  };

  const handleSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleAvatarUpload = (file: File) => {
    uploadAvatarMutation.mutate(file);
  };

  const handleAvatarRemove = () => {
    removeAvatarMutation.mutate();
  };

  // Combine all mutation states
  const loading = updateProfileMutation.isPending || uploadAvatarMutation.isPending || removeAvatarMutation.isPending;
  const success = updateProfileMutation.isSuccess;
  const error = updateProfileMutation.error?.message || uploadAvatarMutation.error?.message || removeAvatarMutation.error?.message;

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
      />
    </Container>
  );
}
