/**
 * Upload Service
 * Handles image uploads to S3 via backend API
 */

import { apiClient } from '../client';

export interface UploadImageResponse {
  url: string;
  filename: string;
}

export const uploadService = {
  /**
   * Upload a single image file
   * POST /api/upload/image
   * Requires authentication
   */
  async uploadImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('image', file);

    // We need to use fetch directly here since we're sending FormData, not JSON
    const token = await import('../../auth/cookies').then(m => m.getAccessToken());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/upload/image`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload image');
    }

    return await response.json();
  },

  /**
   * Upload multiple images
   * Uploads images sequentially and returns all URLs
   */
  async uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.url);
  },
};
