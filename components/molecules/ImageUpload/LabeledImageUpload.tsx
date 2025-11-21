"use client";

import * as React from "react";
import { useCallback, useState, useEffect } from "react";
import { Typography } from "@atoms";
import { PhotoSlot } from "./PhotoSlot";
import { PHOTO_LABELS, type LabeledImage } from "./types";

interface LabeledImageUploadProps {
  maxFiles: number;
  maxSizeMB: number;
  onFilesChange?: (files: File[]) => void;
  initialImages: string[];
  disabled: boolean;
}

export function LabeledImageUpload({
  maxFiles,
  maxSizeMB,
  onFilesChange,
  initialImages,
  disabled,
}: LabeledImageUploadProps) {
  const [labeledImages, setLabeledImages] = useState<LabeledImage[]>(
    PHOTO_LABELS.slice(0, maxFiles).map((label, index) => ({
      label,
      url: initialImages[index],
    }))
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Auto-dismiss error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const onDropLabeled = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length === 0) return;

      // Check file sizes
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maxSizeBytes
      );
      if (oversizedFiles.length > 0) {
        setError(`Slike ne smeju biti veće od ${maxSizeMB}MB`);
        return;
      }

      // Check total file count
      const currentFileCount = labeledImages.filter(
        (img) => img.file || img.url
      ).length;
      const newFileCount = acceptedFiles.length;
      if (currentFileCount + newFileCount > maxFiles) {
        setError(`Možete dodati maksimalno ${maxFiles} slika`);
        return;
      }

      // Create preview URLs and assign to empty slots
      const filesToAdd = acceptedFiles.slice(0, maxFiles - currentFileCount);

      setLabeledImages((prev) => {
        const updated = [...prev];
        let fileIndex = 0;

        for (
          let i = 0;
          i < updated.length && fileIndex < filesToAdd.length;
          i++
        ) {
          if (!updated[i].file && !updated[i].url) {
            const file = filesToAdd[fileIndex];
            updated[i] = {
              ...updated[i],
              file,
              preview: URL.createObjectURL(file),
            };
            fileIndex++;
          }
        }

        return updated;
      });

      // Update selected files (don't call parent callback here)
      setSelectedFiles((prev) => [...prev, ...filesToAdd]);
    },
    [maxSizeMB, maxFiles, labeledImages]
  );

  const removeLabeledImage = (index: number) => {
    const removedFile = labeledImages[index].file;

    setLabeledImages((prev) => {
      const updated = [...prev];
      const removed = updated[index];

      // Revoke preview URL if it exists
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }

      updated[index] = {
        label: removed.label,
      };

      return updated;
    });

    // Update selected files (don't call parent callback here)
    if (removedFile) {
      setSelectedFiles((prev) => prev.filter((f) => f !== removedFile));
    }

    setError(null);
  };

  // Notify parent when selected files change
  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(selectedFiles);
    }
  }, [selectedFiles, onFilesChange]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      labeledImages.forEach((img) => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [labeledImages]);

  return (
    <div className="space-y-4">
      <div>
        <Typography variant="h3" className="mb-2">
          Photos
        </Typography>
        <Typography variant="body" className="text-secondary">
          Add up to {maxFiles} photos in JPEG or PNG format.
        </Typography>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          <Typography variant="bodySmall">{error}</Typography>
        </div>
      )}

      {/* Labeled Photo Slots Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {labeledImages.map((image, index) => (
          <PhotoSlot
            key={image.label}
            label={image.label}
            imageUrl={image.preview || image.url}
            isUploading={false}
            isFirst={index === 0}
            disabled={disabled}
            onDrop={index === 0 ? onDropLabeled : undefined}
            onRemove={() => removeLabeledImage(index)}
          />
        ))}
      </div>

      {/* Helper Text */}
      <div className="flex items-center gap-2 text-secondary">
        <Typography variant="bodySmall">
          {labeledImages.filter((img) => img.url || img.preview).length} /{" "}
          {maxFiles} photos
        </Typography>
      </div>
    </div>
  );
}
