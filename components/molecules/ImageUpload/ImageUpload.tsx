"use client";

import { LabeledImageUpload } from "./LabeledImageUpload";
import { DefaultImageUpload } from "./DefaultImageUpload";
import type { ImageUploadProps } from "./types";

export function ImageUpload({
  maxFiles = 8,
  maxSizeMB = 5,
  onImagesChange,
  onFilesChange,
  initialImages = [],
  disabled = false,
  variant = 'default',
}: ImageUploadProps) {
  if (variant === 'labeled') {
    return (
      <LabeledImageUpload
        maxFiles={maxFiles}
        maxSizeMB={maxSizeMB}
        onFilesChange={onFilesChange}
        initialImages={initialImages}
        disabled={disabled}
      />
    );
  }

  return (
    <DefaultImageUpload
      maxFiles={maxFiles}
      maxSizeMB={maxSizeMB}
      onImagesChange={onImagesChange}
      initialImages={initialImages}
      disabled={disabled}
    />
  );
}

export type { ImageUploadProps } from "./types";
