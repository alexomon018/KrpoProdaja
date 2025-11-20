/**
 * Upload Server Actions
 * Handles image uploads to S3 via backend API with server-side authentication
 */

'use server';

import { getAccessToken } from '@/lib/auth/cookies';

export interface UploadImageResponse {
  url: string;
  filename: string;
}

/**
 * Upload a single image file
 * Server action that securely handles authentication
 */
export async function uploadImageAction(formData: FormData): Promise<UploadImageResponse> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

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
}

/**
 * Upload multiple images
 * Server action that uploads images sequentially and returns all URLs
 */
export async function uploadImagesAction(formDataArray: FormData[]): Promise<string[]> {
  const uploadPromises = formDataArray.map(formData => uploadImageAction(formData));
  const results = await Promise.all(uploadPromises);
  return results.map(result => result.url);
}
