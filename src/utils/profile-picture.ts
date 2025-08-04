/**
 * Utility functions for handling Google profile picture URLs with different sizes
 */

/**
 * Get a profile picture URL with a specific size
 * @param baseUrl - The base profile picture URL from Google (may include existing size parameter)
 * @param size - Desired size in pixels (default: 120)
 * @returns URL with the specified size parameter, or null if no baseUrl provided
 */
export const getProfilePictureUrl = (baseUrl: string | undefined, size: number = 120): string | null => {
  if (!baseUrl) return null;
  
  // Remove existing size parameter if present (e.g., =s96, =s96-c)
  const cleanUrl = baseUrl.replace(/=s\d+(-c)?$/, '');
  
  // Add the new size parameter
  return `${cleanUrl}=s${size}`;
};

/**
 * Extract the base URL from a Google profile picture URL (removing size parameters)
 * @param fullUrl - The full Google profile picture URL
 * @returns The base URL without size parameters
 */
export const getBaseProfilePictureUrl = (fullUrl: string): string => {
  return fullUrl.replace(/=s\d+(-c)?$/, '');
};

/**
 * Common profile picture sizes for different use cases
 */
export const PROFILE_PICTURE_SIZES = {
  THUMBNAIL: 48,    // Small thumbnails, lists
  SMALL: 96,        // Compact displays
  MEDIUM: 120,      // Default profile display
  LARGE: 200,       // Detailed profile pages
  EXTRA_LARGE: 400, // High-resolution displays
  AVATAR: 800,      // Very high quality, download/print
} as const;