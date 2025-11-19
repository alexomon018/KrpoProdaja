"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button, Typography } from "@atoms";
import { uploadService } from "@lib/api";

export interface ImageUploadProps {
  maxFiles?: number;
  maxSizeMB?: number;
  onImagesChange?: (imageUrls: string[]) => void;
  initialImages?: string[];
  disabled?: boolean;
}

interface UploadedImage {
  url: string;
  file?: File;
  preview?: string;
}

export function ImageUpload({
  maxFiles = 5,
  maxSizeMB = 5,
  onImagesChange,
  initialImages = [],
  disabled = false,
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(
    initialImages.map(url => ({ url }))
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);

      // Check file count
      if (images.length + acceptedFiles.length > maxFiles) {
        setError(`Možete dodati maksimalno ${maxFiles} slika`);
        return;
      }

      // Check file sizes
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      const oversizedFiles = acceptedFiles.filter(
        file => file.size > maxSizeBytes
      );
      if (oversizedFiles.length > 0) {
        setError(`Slike ne smeju biti veće od ${maxSizeMB}MB`);
        return;
      }

      setUploading(true);

      try {
        // Create preview URLs for immediate feedback
        const newImages: UploadedImage[] = acceptedFiles.map(file => ({
          url: '',
          file,
          preview: URL.createObjectURL(file),
        }));

        setImages(prev => [...prev, ...newImages]);

        // Upload images sequentially
        const uploadedUrls: string[] = [];
        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = acceptedFiles[i];
          const fileId = file.name + file.size;

          setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

          try {
            const response = await uploadService.uploadImage(file);
            uploadedUrls.push(response.url);

            setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          } catch (err) {
            console.error('Upload failed:', err);
            setError(`Nije uspelo postavljanje slike: ${file.name}`);
            // Remove the failed image from the list
            setImages(prev => prev.filter(img => img.file !== file));
          }
        }

        // Update images with actual URLs
        setImages(prev => {
          const updated = prev.map(img => {
            if (img.file) {
              const index = acceptedFiles.indexOf(img.file);
              if (index !== -1 && uploadedUrls[index]) {
                // Revoke preview URL to avoid memory leaks
                if (img.preview) {
                  URL.revokeObjectURL(img.preview);
                }
                return { url: uploadedUrls[index] };
              }
            }
            return img;
          });

          // Notify parent of changes
          if (onImagesChange) {
            onImagesChange(updated.map(img => img.url).filter(Boolean));
          }

          return updated;
        });
      } catch (err) {
        console.error('Upload error:', err);
        setError('Greška pri postavljanju slika. Pokušajte ponovo.');
      } finally {
        setUploading(false);
        setUploadProgress({});
      }
    },
    [images, maxFiles, maxSizeMB, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic'],
    },
    maxFiles: maxFiles - images.length,
    disabled: disabled || uploading || images.length >= maxFiles,
  });

  const removeImage = (index: number) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index);

      // Revoke preview URL if it exists
      const removed = prev[index];
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }

      // Notify parent of changes
      if (onImagesChange) {
        onImagesChange(updated.map(img => img.url).filter(Boolean));
      }

      return updated;
    });
    setError(null);
  };

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${isDragActive
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-border hover:border-primary/50 hover:bg-surface/50'
            }
            ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              {uploading ? (
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>

            <div className="space-y-1">
              <Typography variant="body" className="font-medium">
                {isDragActive
                  ? 'Pustite slike ovde...'
                  : 'Prevucite slike ili kliknite za izbor'}
              </Typography>
              <Typography variant="bodySmall" className="text-secondary">
                PNG, JPG, WEBP do {maxSizeMB}MB • Maksimalno {maxFiles} slika
              </Typography>
            </div>

            {!uploading && (
              <Button type="button" variant="secondary" size="sm" disabled={disabled}>
                Izaberite slike
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          <Typography variant="bodySmall">{error}</Typography>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.url || image.preview || index}
              className="relative aspect-square rounded-lg overflow-hidden border border-border group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.preview || image.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Upload Progress Overlay */}
              {image.file && !image.url && uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Remove Button */}
              {!uploading && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                  aria-label="Ukloni sliku"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* First Image Badge */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                  Glavna
                </div>
              )}
            </div>
          ))}

          {/* Add More Button */}
          {images.length < maxFiles && (
            <button
              type="button"
              {...getRootProps()}
              disabled={disabled || uploading}
              className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-surface/50 flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ImageIcon className="w-8 h-8 text-secondary" />
              <Typography variant="bodySmall" className="text-secondary">
                Dodaj još
              </Typography>
            </button>
          )}
        </div>
      )}

      {/* Helper Text */}
      {images.length > 0 && (
        <div className="flex items-center gap-2 text-secondary">
          <Typography variant="bodySmall">
            {images.length} / {maxFiles} slika {uploading && '• Postavljanje...'}
          </Typography>
        </div>
      )}
    </div>
  );
}
