import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { User } from "../types/User";
import { PotteryPiece } from "../types/Piece";
import { getUserByUsernameAPI, getUserStatsAPI, UserStats } from "../network/users";
import { getUserRecentPiecesAPI } from "../network/pieces";
import { getStageIcon } from "../utils/labels-and-icons";
import { getCurrentUser } from "../stores/user";
import ProfilePicture from "../components/ProfilePicture";
import "./Profile.css";

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const [user, setUser] = useState<User | null>(null);
  const [recentPieces, setRecentPieces] = useState<PotteryPiece[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [recentPiecesLoading, setRecentPiecesLoading] = useState(false);

  // Redirect to own profile if viewing own username
  useEffect(() => {
    if (currentUser && username === currentUser.username) {
      navigate("/profile");
      return;
    }
  }, [currentUser, username, navigate]);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      if (!username) {
        setError("Invalid username");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const userData = await getUserByUsernameAPI(username);
        if (!userData) {
          setError("User not found");
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;

      setStatsLoading(true);
      try {
        const stats = await getUserStatsAPI(user.id);
        setUserStats(stats);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  // Fetch recent pieces
  useEffect(() => {
    const fetchRecentPieces = async () => {
      if (!user) return;

      setRecentPiecesLoading(true);
      try {
        const pieces = await getUserRecentPiecesAPI(user.id);
        setRecentPieces(pieces);
      } catch (error) {
        console.error("Failed to fetch recent pieces:", error);
      } finally {
        setRecentPiecesLoading(false);
      }
    };

    fetchRecentPieces();
  }, [user]);

  if (loading) {
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

  if (error || !user) {
    return (
      <div className="profile-page">
        <div className="empty-state">
          <div className="icon">👤</div>
          <h2>User Not Found</h2>
          <p>{error || "The user you're looking for doesn't exist."}</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalPieces = userStats?.totalPieces ?? 0;
  const completedPieces = userStats?.completedPieces ?? 0;
  const activePieces = userStats?.activePieces ?? 0;
  const starredPieces = userStats?.starredPieces ?? 0;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="edit-profile-btn">
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            ← Back
          </button>
        </div>

        <div className="profile-info">
          <ProfilePicture
            profilePicture={user.profilePicture}
            userName={`${user.firstName} ${user.lastName}`}
            size="LARGE"
            className="profile-avatar-custom"
          />
          <div className="profile-details">
            <h1>
              {user.firstName} {user.lastName}
            </h1>
            <div className="title">{user.title}</div>
            {user.location && (
              <div className="location">📍 {user.location}</div>
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
            <div className="bio-text">
              {user.bio || "This user hasn't written a bio yet."}
            </div>
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
                <p>No public pottery pieces yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="profile-sidebar">
          <div className="profile-section">
            <h3>📞 Contact Info</h3>
            <ul className="contact-info">
              <li>
                <span className="icon">📧</span>
                <a href={`mailto:${user.email}`}>
                  {user.email}
                </a>
              </li>
              {user.website && (
                <li>
                  <span className="icon">🌐</span>
                  <a
                    href={user.website}
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
                  to={`/profile/${user.username}`}
                  className="username-link"
                >
                  @{user.username}
                </Link>
              </li>
            </ul>
          </div>

          <div className="profile-section">
            <h3>🔗 Social Links</h3>
            <div className="social-links-list">
              {user.socials.instagram && (
                <div className="social-link-item">
                  <span className="social-icon">📷</span>
                  <a
                    href={user.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.socials.instagram}
                  </a>
                </div>
              )}
              {user.socials.twitter && (
                <div className="social-link-item">
                  <span className="social-icon">🐦</span>
                  <a
                    href={user.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.socials.twitter}
                  </a>
                </div>
              )}
              {user.socials.facebook && (
                <div className="social-link-item">
                  <span className="social-icon">📘</span>
                  <a
                    href={user.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.socials.facebook}
                  </a>
                </div>
              )}
              {user.socials.youtube && (
                <div className="social-link-item">
                  <span className="social-icon">📺</span>
                  <a
                    href={user.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.socials.youtube}
                  </a>
                </div>
              )}
              {user.socials.linkedin && (
                <div className="social-link-item">
                  <span className="social-icon">💼</span>
                  <a
                    href={user.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.socials.linkedin}
                  </a>
                </div>
              )}
              {!Object.values(user.socials).some((link) => link) && (
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "0.9rem",
                  }}
                >
                  No social links available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;