"use client";

import { ImageUpload } from "@molecules";
import { Typography } from "@atoms";

interface ProductImagesProps {
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

export function ProductImages({ onFilesChange, disabled }: ProductImagesProps) {
  return (
    <div className="bg-surface rounded-xl p-6 md:p-8 border border-border shadow-sm">
      <ImageUpload
        variant="labeled"
        maxFiles={8}
        maxSizeMB={5}
        onFilesChange={onFilesChange}
        disabled={disabled}
      />
    </div>
  );
}
