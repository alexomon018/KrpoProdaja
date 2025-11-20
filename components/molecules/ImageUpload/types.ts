export interface ImageUploadProps {
  maxFiles?: number;
  maxSizeMB?: number;
  onImagesChange?: (imageUrls: string[]) => void;
  onFilesChange?: (files: File[]) => void;
  initialImages?: string[];
  disabled?: boolean;
  variant?: 'default' | 'labeled';
}

export interface UploadedImage {
  url: string;
  file?: File;
  preview?: string;
}

export interface LabeledImage {
  label: string;
  url?: string;
  file?: File;
  preview?: string;
}

export const PHOTO_LABELS = [
  'Cover photo',
  'Front',
  'Back',
  'Side',
  'Label',
  'Detail',
  'Flaw',
  'Extra'
] as const;
