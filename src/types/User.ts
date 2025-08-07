export interface UserSocials {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  behance?: string;
}

export interface User {
  id: string; // UUID
  googleId?: string; // Google OAuth ID
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  title: string;
  bio: string;
  website: string;
  socials: UserSocials;
  username: string;
  profilePicture?: string; // Profile picture URL from Google OAuth
  image?: string; // Custom uploaded profile image URL
}