"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/atoms/Button/Button";
import { FormInput } from "@/components/atoms/FormInput/FormInput";
import { AvatarUpload } from "./AvatarUpload";

export interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  avatar?: File;
}

export interface ProfileEditFormProps {
  /**
   * Initial profile data
   */
  initialData?: Partial<ProfileFormData>;
  /**
   * Current avatar URL
   */
  currentAvatar?: string;
  /**
   * Callback when form is submitted
   */
  onSubmit: (data: ProfileFormData) => void;
  /**
   * Callback when avatar is uploaded
   */
  onAvatarUpload?: (file: File) => void;
  /**
   * Callback when avatar is removed
   */
  onAvatarRemove?: () => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Success message
   */
  success?: boolean;
}

/**
 * ProfileEditForm Component - Atomic Design: Molecule
 *
 * Profile creation/editing form with avatar upload
 *
 * @example
 * ```tsx
 * <ProfileEditForm
 *   initialData={{ name: "Marko", email: "marko@example.com" }}
 *   currentAvatar="/avatar.jpg"
 *   onSubmit={(data) => console.log(data)}
 *   onAvatarUpload={(file) => console.log(file)}
 * />
 * ```
 */
export function ProfileEditForm({
  initialData,
  currentAvatar,
  onSubmit,
  onAvatarUpload,
  onAvatarRemove,
  loading = false,
  error,
  success = false,
}: ProfileEditFormProps) {
  const methods = useForm<ProfileFormData>({
    defaultValues: initialData,
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {success && (
        <div className="bg-semantic-success/10 border border-semantic-success/20 text-semantic-success px-4 py-3 rounded-lg text-sm">
          Profil uspešno sačuvan!
        </div>
      )}

      {error && (
        <div className="bg-semantic-error/10 border border-semantic-error/20 text-semantic-error px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Profilna slika</h2>
        <AvatarUpload
          currentAvatar={currentAvatar}
          userName={initialData?.name}
          onUpload={(file) => {
            methods.setValue("avatar", file);
            onAvatarUpload?.(file);
          }}
          onRemove={onAvatarRemove}
          loading={loading}
        />
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Osnovne informacije</h2>

            <FormInput
              name="name"
              type="text"
              label="Ime i prezime"
              placeholder="Marko Marković"
              required
              disabled={loading}
            />

            <FormInput
              name="email"
              type="email"
              label="Email adresa"
              placeholder="tvoj.email@primer.com"
              required
              disabled={loading}
            />

            <FormInput
              name="phone"
              type="tel"
              label="Broj telefona"
              placeholder="+381 60 123 4567"
              disabled={loading}
            />
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Dodatne informacije</h2>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Biografija
              </label>
              <textarea
                {...methods.register("bio")}
                placeholder="Reci nam nešto o sebi..."
                rows={4}
                disabled={loading}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            <FormInput
              name="location"
              type="text"
              label="Lokacija"
              placeholder="Beograd, Srbija"
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Sačuvaj izmene
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              disabled={loading}
              onClick={() => methods.reset(initialData)}
            >
              Poništi
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
