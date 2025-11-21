/**
 * Upload Server Actions
 * Handles image uploads to S3 via backend API with server-side authentication
 */

"use server";

import { getAccessToken } from "@/lib/auth/cookies";

export interface UploadedImage {
  url: string;
  key: string;
  size: number;
  width: number;
  height: number;
}

export interface UploadImageResponse {
  success: boolean;
  data: UploadedImage;
}

/**
 * Upload a single image file
 * Server action that securely handles authentication
 * POST /api/upload/image
 */
export async function uploadImageAction(formData: FormData): Promise<string> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
    }/upload/image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Upload failed" }));
    throw new Error(error.message || "Failed to upload image");
  }

  const result: UploadImageResponse = await response.json();

  // Validate that we got a URL
  if (!result?.data?.url) {
    console.error("Invalid response from upload API:", result);
    throw new Error("Upload response missing URL");
  }

  // Extract just the URL from the response object
  return result.data.url;
}

/**
 * Upload multiple images
 * Server action that uploads images sequentially and returns all URLs
 */
export async function uploadImagesAction(
  formDataArray: FormData[]
): Promise<string[]> {
  const uploadPromises = formDataArray.map((formData) =>
    uploadImageAction(formData)
  );
  const urls = await Promise.all(uploadPromises);
  return urls;
}
