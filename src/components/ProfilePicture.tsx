import React from "react";
import { getProfilePictureUrl, PROFILE_PICTURE_SIZES } from "../utils/profile-picture";
import "./ProfilePicture.css";

interface ProfilePictureProps {
  /** Base profile picture URL from user data */
  profilePicture?: string;
  /** User's name for alt text */
  userName: string;
  /** Size variant for the profile picture */
  size?: keyof typeof PROFILE_PICTURE_SIZES | number;
  /** Additional CSS class name */
  className?: string;
  /** Click handler for interactive profile pictures */
  onClick?: () => void;
}

/**
 * Reusable ProfilePicture component that handles Google profile picture sizing
 * and provides fallback to pottery emoji when no picture is available
 * 
 * @example
 * // Large profile picture for profile page
 * <ProfilePicture 
 *   profilePicture={user.profilePicture} 
 *   userName={user.firstName + ' ' + user.lastName}
 *   size="LARGE" 
 * />
 * 
 * @example
 * // Small thumbnail for lists/comments
 * <ProfilePicture 
 *   profilePicture={user.profilePicture} 
 *   userName={user.firstName + ' ' + user.lastName}
 *   size="THUMBNAIL" 
 * />
 * 
 * @example
 * // Custom size
 * <ProfilePicture 
 *   profilePicture={user.profilePicture} 
 *   userName={user.firstName + ' ' + user.lastName}
 *   size={150} 
 * />
 */
export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profilePicture,
  userName,
  size = "MEDIUM",
  className = "",
  onClick,
}) => {
  // Convert size to pixel value
  const sizePixels = typeof size === "string" ? PROFILE_PICTURE_SIZES[size] : size;
  
  // Get the appropriately sized profile picture URL
  const imageUrl = getProfilePictureUrl(profilePicture, sizePixels);

  const baseClassName = `profile-picture-component ${className}`;
  const interactiveClassName = onClick ? "profile-picture-interactive" : "";
  const sizeClassName = typeof size === "string" ? `profile-picture-${size.toLowerCase()}` : "";

  const style = {
    width: `${sizePixels}px`,
    height: `${sizePixels}px`,
  };

  return (
    <div 
      className={`${baseClassName} ${interactiveClassName} ${sizeClassName}`.trim()}
      style={style}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={userName}
          className="profile-picture-image"
        />
      ) : (
        <div className="profile-picture-fallback">🏺</div>
      )}
    </div>
  );
};

export default ProfilePicture;