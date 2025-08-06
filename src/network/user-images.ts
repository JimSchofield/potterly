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

export const getUserImagesAPI = async (userId: string): Promise<UserImage[]> => {
  const response = await fetch(`/api/user-images/list?userId=${userId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to fetch user images: ${response.statusText}`);
  }

  const data = await response.json();
  return data.images;
};

export const getUserImageAPI = async (userId: string, imageKey: string): Promise<Blob> => {
  const response = await fetch(`/api/user-images/${imageKey}?userId=${userId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to fetch image: ${response.statusText}`);
  }

  return response.blob();
};

export const deleteUserImageAPI = async (userId: string, imageKey: string): Promise<void> => {
  const response = await fetch(`/api/user-images/${imageKey}?userId=${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to delete image: ${response.statusText}`);
  }
};