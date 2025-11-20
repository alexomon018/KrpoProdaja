/**
 * Upload Service
 * Client-side wrapper for upload server actions
 */

import { uploadImageAction, uploadImagesAction } from '../actions/upload';

export interface UploadImageResponse {
  url: string;
  filename: string;
}

export const uploadService = {
  /**
   * Upload a single image file
   * Uses server action for secure authentication
   */
  async uploadImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('image', file);

    return await uploadImageAction(formData);
  },

  /**
   * Upload multiple images
   * Uploads images in parallel and returns all URLs
   */
  async uploadImages(files: File[]): Promise<string[]> {
    const formDataArray = files.map(file => {
      const formData = new FormData();
      formData.append('image', file);
      return formData;
    });

    return await uploadImagesAction(formDataArray);
  },
};
