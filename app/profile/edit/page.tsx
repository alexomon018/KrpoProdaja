"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ProfileEditForm, ProfileFormData } from "@/components/molecules/AuthForm/ProfileEditForm";
import { Container } from "@/components/atoms/Container/Container";
import { Typography } from "@/components/atoms/Typography/Typography";

/**
 * Profile Edit Page
 *
 * Edit user profile information and avatar
 */
export default function ProfileEditPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [avatarUrl, setAvatarUrl] = React.useState<string>();

  // Mock initial data - TODO: fetch from backend
  const initialData: Partial<ProfileFormData> = {
    name: "Marko Marković",
    email: "marko@example.com",
    phone: "+381 60 123 4567",
    bio: "Ljubitelj tehnologije i dobrih kupovina. Prodajem kvalitetne polovne stvari.",
    location: "Beograd, Srbija",
  };

  const handleSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setError(undefined);
    setSuccess(false);

    try {
      // TODO: Implement profile update
      console.log("Profile update data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);

      // Redirect to profile after a short delay
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err) {
      setError("Greška pri čuvanju profila. Molimo pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      // TODO: Implement avatar upload
      console.log("Uploading avatar:", file);

      // Simulate API call and get URL
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    } catch (err) {
      setError("Greška pri učitavanju slike. Molimo pokušajte ponovo.");
    }
  };

  const handleAvatarRemove = async () => {
    try {
      // TODO: Implement avatar removal
      console.log("Removing avatar");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAvatarUrl(undefined);
    } catch (err) {
      setError("Greška pri uklanjanju slike. Molimo pokušajte ponovo.");
    }
  };

  return (
    <Container className="py-8">
      <div className="mb-8">
        <Typography variant="h1" className="text-center">
          Izmeni profil
        </Typography>
        <Typography variant="body" className="text-center text-text-secondary mt-2">
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
