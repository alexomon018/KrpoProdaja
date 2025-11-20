"use client";

import { useDropzone } from "react-dropzone";
import { X, Camera } from "@atoms";
import { Typography } from "@atoms";

interface PhotoSlotProps {
  label: string;
  imageUrl?: string;
  isUploading: boolean;
  isFirst: boolean;
  disabled: boolean;
  onDrop?: (files: File[]) => void;
  onRemove: () => void;
}

export function PhotoSlot({
  label,
  imageUrl,
  isUploading,
  isFirst,
  disabled,
  onDrop,
  onRemove,
}: PhotoSlotProps) {
  const dropzoneConfig = isFirst && onDrop ? {
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    disabled: disabled || isUploading,
    multiple: true,
  } : { disabled: true };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneConfig);

  const hasImage = !!imageUrl;

  return (
    <div
      {...(isFirst ? getRootProps() : {})}
      className={`
        relative aspect-square rounded-xl border-2 border-dashed overflow-hidden
        transition-all group
        ${isFirst && !hasImage ? 'cursor-pointer' : ''}
        ${isDragActive && isFirst
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : hasImage
          ? 'border-transparent'
          : 'border-border hover:border-primary/50 hover:bg-surface/50'
        }
        ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {isFirst && <input {...getInputProps()} />}

      {hasImage ? (
        <>
          {/* Image Display */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-full object-cover"
          />

          {/* Upload Progress Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Remove Button */}
          {!isUploading && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              disabled={disabled}
              className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
              aria-label="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Label Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <Typography variant="bodySmall" className="text-white font-medium">
              {label}
            </Typography>
          </div>
        </>
      ) : (
        <>
          {/* Empty State */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            {isFirst ? (
              <>
                <div className="w-12 h-12 mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <Typography variant="bodySmall" className="font-medium text-primary">
                  Add a photo
                </Typography>
              </>
            ) : (
              <Typography variant="body" className="font-medium text-secondary">
                {label}
              </Typography>
            )}
          </div>
        </>
      )}
    </div>
  );
}
