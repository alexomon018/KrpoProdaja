"use client";

import { useProfileEditor } from "@/lib/api/hooks/useProfileEditor";
import { ProfileEditForm } from "@/components/molecules/AuthForm/ProfileEditForm";
import { PhoneVerificationModal } from "@/components/molecules/PhoneVerificationModal";
import { Container } from "@/components/atoms/Container/Container";
import { Typography } from "@/components/atoms/Typography/Typography";

export function ProfileEditor() {
  const {
    initialData,
    avatarUrl,
    isPhoneVerified,
    loading,
    success,
    error,
    handleSubmit,
    handleAvatarUpload,
    handleAvatarRemove,
    handlePhoneVerified,
    showPhoneVerification,
    setShowPhoneVerification,
    pendingPhoneNumber,
  } = useProfileEditor();

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
        isPhoneVerified={isPhoneVerified}
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
