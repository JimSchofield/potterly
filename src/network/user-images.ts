export interface UserImage {
  imageKey: string;
  imageId: string;
  etag: string;
  contentType: string;
  size: number;
  uploadedAt: string;
  url: string;
}

export interface UploadImageResponse {
  success: boolean;
  imageId: string;
  imageKey: string;
  contentType: string;
  size: number;
  url: string;
}

export const uploadUserImageAPI = async (userId: string, imageFile: File): Promise<UploadImageResponse> => {
  const response = await fetch(`/api/user-images/upload?userId=${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': imageFile.type,
    },
    body: imageFile,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to upload image: ${response.statusText}`);
  }

  return response.json();
};
