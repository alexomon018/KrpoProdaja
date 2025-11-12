"use client";

import * as React from "react";
import { Avatar } from "@/components/atoms/Avatar/Avatar";
import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";

export interface AvatarUploadProps {
  /**
   * Current avatar URL
   */
  currentAvatar?: string;
  /**
   * User's name for avatar fallback
   */
  userName?: string;
  /**
   * Callback when avatar is uploaded
   */
  onUpload: (file: File) => void;
  /**
   * Callback when avatar is removed
   */
  onRemove?: () => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Error message
   */
  error?: string;
  /**
   * Max file size in MB
   */
  maxSizeMB?: number;
}

/**
 * AvatarUpload Component - Atomic Design: Molecule
 *
 * Avatar upload component with preview and validation
 *
 * @example
 * ```tsx
 * <AvatarUpload
 *   currentAvatar="/avatar.jpg"
 *   userName="Marko Marković"
 *   onUpload={(file) => console.log(file)}
 *   onRemove={() => console.log("Remove avatar")}
 * />
 * ```
 */
export function AvatarUpload({
  currentAvatar,
  userName,
  onUpload,
  onRemove,
  loading = false,
  error,
  maxSizeMB = 5,
}: AvatarUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | undefined>(currentAvatar);
  const [localError, setLocalError] = React.useState<string | undefined>(error);

  React.useEffect(() => {
    setPreview(currentAvatar);
  }, [currentAvatar]);

  React.useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setLocalError("Molimo odaberite sliku");
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setLocalError(`Slika mora biti manja od ${maxSizeMB}MB`);
      return;
    }

    setLocalError(undefined);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call upload callback
    onUpload(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
    setLocalError(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar
          src={preview}
          alt={userName}
          fallback={userName}
          size="xl"
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {localError && (
        <div className="text-semantic-error text-sm text-center">
          {localError}
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />

        <Button
          variant="secondary"
          size="sm"
          onClick={handleClick}
          disabled={loading}
        >
          <Icon name="Upload" size={16} />
          {preview ? "Promeni sliku" : "Dodaj sliku"}
        </Button>

        {preview && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={loading}
          >
            <Icon name="Trash2" size={16} />
            Ukloni
          </Button>
        )}
      </div>

      <p className="text-xs text-text-tertiary text-center">
        PNG, JPG ili GIF. Maksimalno {maxSizeMB}MB.
      </p>
    </div>
  );
}
