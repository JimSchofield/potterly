import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { useNavigate, Link } from "react-router-dom";
import {
  userStore,
  isUserAuthenticated,
  getCurrentUser,
  logoutUser,
  updateUserProfile,
} from "../stores/user";
import { PotteryPiece } from "../types/Piece";
import { UserStats, getUserStatsAPI } from "../network/users";
import { getUserRecentPiecesAPI } from "../network/pieces";
import { uploadUserImageAPI } from "../network/user-images";
import { getStageIcon } from "../utils/labels-and-icons";
import { setLoading } from "../stores/loading";
import ProfilePicture from "../components/ProfilePicture";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const user = useStore(userStore);
  const [recentPieces, setRecentPieces] = useState<PotteryPiece[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [recentPiecesLoading, setRecentPiecesLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    title: "",
    bio: "",
    location: "",
    website: "",
    socials: {
      instagram: "",
      twitter: "",
      facebook: "",
      youtube: "",
      linkedin: "",
    },
  });
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isUserAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  // Fetch user statistics from database
  useEffect(() => {
    const fetchUserStats = async () => {
      const currentUser = getCurrentUser();
      if (currentUser && !statsLoading) {
        setStatsLoading(true);
        try {
          const stats = await getUserStatsAPI(currentUser.id);
          setUserStats(stats);
        } catch (error) {
          console.error("Error fetching user stats:", error);
        } finally {
          setStatsLoading(false);
        }
      }
    };

    fetchUserStats();
  }, [user.user]);

  // Fetch recent pieces from database
  useEffect(() => {
    const fetchRecentPieces = async () => {
      const currentUser = getCurrentUser();
      if (currentUser && !recentPiecesLoading) {
        setRecentPiecesLoading(true);
        try {
          const pieces = await getUserRecentPiecesAPI(currentUser.id);
          setRecentPieces(pieces);
        } catch (error) {
          console.error("Failed to fetch recent pieces:", error);
        } finally {
          setRecentPiecesLoading(false);
        }
      }
    };

    fetchRecentPieces();
  }, [user.user]);

  // Populate form when entering edit mode
  useEffect(() => {
    if (isEditing && user.user) {
      setEditForm({
        firstName: user.user.firstName || "",
        lastName: user.user.lastName || "",
        title: user.user.title || "",
        bio: user.user.bio || "",
        location: user.user.location || "",
        website: user.user.website || "",
        socials: {
          instagram: user.user.socials?.instagram || "",
          twitter: user.user.socials?.twitter || "",
          facebook: user.user.socials?.facebook || "",
          youtube: user.user.socials?.youtube || "",
          linkedin: user.user.socials?.linkedin || "",
        },
      });
    }
  }, [isEditing, user.user]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!user.user) return;

    try {
      await updateUserProfile(user.user.id, editForm);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platform]: value,
      },
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!user.user) return;

    try {
      setImageUploadLoading(true);
      setLoading(true, "Uploading profile image..."); // Show global loading overlay
      console.log("Starting image upload for file:", file.name);
      
      // Upload image to blob storage
      const uploadResult = await uploadUserImageAPI(user.user.id, file);
      console.log("Image upload successful:", uploadResult);
      
      // Update user profile with new image URL
      const updatedUser = await updateUserProfile(user.user.id, {
        image: uploadResult.url,
      });
      console.log("User profile updated:", updatedUser);
      
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      
      // Show user-friendly error message
      let errorMessage = "Failed to upload image. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("413") || error.message.includes("size")) {
          errorMessage = "Image is too large. Please use a smaller image (max 3MB).";
        } else if (error.message.includes("400") || error.message.includes("Content-Type")) {
          errorMessage = "Invalid image format. Please use JPG, PNG, or WebP.";
        }
      }
      
      alert(errorMessage);
    } finally {
      setImageUploadLoading(false);
      setLoading(false); // Hide global loading overlay
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size before upload (3MB limit for development)
      const maxSize = 3 * 1024 * 1024; // 3MB
      if (file.size > maxSize) {
        alert(`Image size must be less than ${maxSize / 1024 / 1024}MB. Your image is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please compress or resize your image.`);
        e.target.value = '';
        return;
      }
      
      handleImageUpload(file);
      // Clear the input to allow re-uploading the same file
      e.target.value = '';
    }
  };

  if (user.loading) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar loading-skeleton"></div>
            <div className="profile-details">
              <div className="loading-skeleton skeleton-title"></div>
              <div className="loading-skeleton skeleton-text"></div>
              <div className="loading-skeleton skeleton-text"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user.user) {
    return (
      <div className="profile-page">
        <div className="empty-state">
          <div className="icon">👤</div>
          <h2>No Profile Found</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const currentUser = user.user;

  // Use API stats (no fallback since we're fetching from database)
  const totalPieces = userStats?.totalPieces ?? 0;
  const completedPieces = userStats?.completedPieces ?? 0;
  const activePieces = userStats?.activePieces ?? 0;
  const starredPieces = userStats?.starredPieces ?? 0;

  // Recent pieces are now fetched directly from the database API

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="edit-profile-btn">
          {isEditing ? (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                className="btn btn--primary"
                onClick={handleSaveProfile}
                disabled={user.loading}
              >
                {user.loading ? "Saving..." : "Save"}
              </button>
              <button className="btn btn--outline" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn--secondary" onClick={handleEditProfile}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-info">
          <div className="profile-avatar-container">
            <ProfilePicture
              profilePicture={currentUser.profilePicture}
              customImage={currentUser.image}
              userName={`${currentUser.firstName} ${currentUser.lastName}`}
              size="LARGE"
              className="profile-avatar-custom"
            />
            {isEditing && (
              <div className="image-upload-overlay">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  style={{ display: "none" }}
                  id="profile-image-input"
                  disabled={imageUploadLoading}
                />
                <label htmlFor="profile-image-input" className="image-upload-button">
                  {imageUploadLoading ? "Uploading..." : "📷 Change Photo"}
                </label>
              </div>
            )}
          </div>
          <div className="profile-details">
            {isEditing ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="First Name"
                    className="form-input"
                    style={{ fontSize: "1.5rem", fontWeight: "600" }}
                  />
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Last Name"
                    className="form-input"
                    style={{ fontSize: "1.5rem", fontWeight: "600" }}
                  />
                </div>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Title"
                  className="form-input"
                  style={{ fontSize: "1.1rem" }}
                />
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Location"
                  className="form-input"
                />
              </div>
            ) : (
              <>
                <h1>
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                <div className="title">{currentUser.title}</div>
                {currentUser.location && (
                  <div className="location">📍 {currentUser.location}</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">
            {statsLoading ? "..." : totalPieces}
          </div>
          <div className="stat-label">Total Pieces</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {statsLoading ? "..." : activePieces}
          </div>
          <div className="stat-label">Active Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {statsLoading ? "..." : completedPieces}
          </div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {statsLoading ? "..." : starredPieces}
          </div>
          <div className="stat-label">Starred</div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-section">
            <h3>📝 About</h3>
            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself and your pottery journey..."
                className="form-textarea"
                rows={4}
                style={{ width: "100%", resize: "vertical" }}
              />
            ) : (
              <div className="bio-text">
                {currentUser.bio ||
                  "No bio available. Click Edit Profile to add one!"}
              </div>
            )}
          </div>

          <div className="profile-section">
            <h3>🏺 Recent Work</h3>
            {recentPiecesLoading ? (
              <div className="loading-state">
                <p>Loading recent pieces...</p>
              </div>
            ) : recentPieces.length > 0 ? (
              <div className="recent-pieces">
                {recentPieces.map((piece) => (
                  <div
                    key={piece.id}
                    className="piece-thumbnail"
                    onClick={() => navigate(`/piece/${piece.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="stage-icon">
                      {getStageIcon(piece.stage)}
                    </div>
                    <div className="piece-title">{piece.title}</div>
                    <div className="piece-stage">{piece.stage}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="icon">🏺</div>
                <p>No pottery pieces yet. Start creating!</p>
              </div>
            )}
          </div>
        </div>

        <div className="profile-sidebar">
          <div className="profile-section">
            <h3>📞 Contact Info</h3>
            {isEditing ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    Email (read-only)
                  </label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="form-input"
                    style={{
                      backgroundColor: "var(--color-background)",
                      cursor: "not-allowed",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://yourwebsite.com"
                    className="form-input"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    Username (read-only)
                  </label>
                  <input
                    type="text"
                    value={currentUser.username}
                    disabled
                    className="form-input"
                    style={{
                      backgroundColor: "var(--color-background)",
                      cursor: "not-allowed",
                    }}
                  />
                </div>
              </div>
            ) : (
              <ul className="contact-info">
                <li>
                  <span className="icon">📧</span>
                  <a href={`mailto:${currentUser.email}`}>
                    {currentUser.email}
                  </a>
                </li>
                {currentUser.website && (
                  <li>
                    <span className="icon">🌐</span>
                    <a
                      href={currentUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                    </a>
                  </li>
                )}
                <li>
                  <span className="icon">👤</span>
                  <Link
                    to={`/profile/${currentUser.username}`}
                    className="username-link"
                  >
                    @{currentUser.username}
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="profile-section">
            <h3>🔗 Social Links</h3>
            {isEditing ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    📷 Instagram
                  </label>
                  <input
                    type="url"
                    value={editForm.socials.instagram}
                    onChange={(e) =>
                      handleSocialChange("instagram", e.target.value)
                    }
                    placeholder="https://instagram.com/yourusername"
                    className="form-input"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    🐦 Twitter
                  </label>
                  <input
                    type="url"
                    value={editForm.socials.twitter}
                    onChange={(e) =>
                      handleSocialChange("twitter", e.target.value)
                    }
                    placeholder="https://twitter.com/yourusername"
                    className="form-input"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    📘 Facebook
                  </label>
                  <input
                    type="url"
                    value={editForm.socials.facebook}
                    onChange={(e) =>
                      handleSocialChange("facebook", e.target.value)
                    }
                    placeholder="https://facebook.com/yourusername"
                    className="form-input"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    📺 YouTube
                  </label>
                  <input
                    type="url"
                    value={editForm.socials.youtube}
                    onChange={(e) =>
                      handleSocialChange("youtube", e.target.value)
                    }
                    placeholder="https://youtube.com/@yourusername"
                    className="form-input"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    💼 LinkedIn
                  </label>
                  <input
                    type="url"
                    value={editForm.socials.linkedin}
                    onChange={(e) =>
                      handleSocialChange("linkedin", e.target.value)
                    }
                    placeholder="https://linkedin.com/in/yourusername"
                    className="form-input"
                  />
                </div>
              </div>
            ) : (
              <div className="social-links-list">
                {currentUser.socials.instagram && (
                  <div className="social-link-item">
                    <span className="social-icon">📷</span>
                    <a
                      href={currentUser.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {currentUser.socials.instagram}
                    </a>
                  </div>
                )}
                {currentUser.socials.twitter && (
                  <div className="social-link-item">
                    <span className="social-icon">🐦</span>
                    <a
                      href={currentUser.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {currentUser.socials.twitter}
                    </a>
                  </div>
                )}
                {currentUser.socials.facebook && (
                  <div className="social-link-item">
                    <span className="social-icon">📘</span>
                    <a
                      href={currentUser.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {currentUser.socials.facebook}
                    </a>
                  </div>
                )}
                {currentUser.socials.youtube && (
                  <div className="social-link-item">
                    <span className="social-icon">📺</span>
                    <a
                      href={currentUser.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {currentUser.socials.youtube}
                    </a>
                  </div>
                )}
                {currentUser.socials.linkedin && (
                  <div className="social-link-item">
                    <span className="social-icon">💼</span>
                    <a
                      href={currentUser.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {currentUser.socials.linkedin}
                    </a>
                  </div>
                )}
                {!Object.values(currentUser.socials).some((link) => link) && (
                  <p
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    No social links yet
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="profile-section">
            <h3>⚙️ Account</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <button className="btn btn--outline" onClick={handleEditProfile}>
                Edit Profile
              </button>
              <button className="btn btn--danger" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
