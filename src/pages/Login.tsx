import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useStore } from "@nanostores/react";
import {
  userStore,
  createUser,
  loginUserByGoogleId,
  isUserAuthenticated,
} from "../stores/user";
import { getBaseProfilePictureUrl } from "../utils/profile-picture";
import "./Login.css";

interface GoogleJwtPayload {
  sub: string; // Google user ID
  email: string; // User's email
  name: string; // Full name
  given_name: string; // First name
  family_name: string; // Last name
  picture: string; // Profile picture URL
  email_verified: boolean;
  iss: string; // Issuer
  aud: string; // Audience
  iat: number; // Issued at
  exp: number; // Expires at
}

const Login = () => {
  const navigate = useNavigate();
  const user = useStore(userStore);

  // Redirect if already authenticated
  useEffect(() => {
    if (isUserAuthenticated()) {
      navigate("/home");
    }
  }, [navigate]);

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received");
      }

      // Decode the JWT token to get user information
      const decoded = jwtDecode<GoogleJwtPayload>(
        credentialResponse.credential,
      );

      console.log("Google login successful:", decoded);

      // First try to login with existing user using Google ID
      try {
        await loginUserByGoogleId(decoded.sub);
        navigate("/home");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        // If user doesn't exist, create a new user with Google data
        console.log("User not found, creating new user with Google data");

        const googleUser = {
          googleId: decoded.sub,
          firstName: decoded.given_name || "",
          lastName: decoded.family_name || "",
          email: decoded.email,
          location: "", // We'll let user fill this in later
          title: "Potter", // Default title
          bio: `Welcome to Potterly! Joined via Google on ${new Date().toLocaleDateString()}`,
          website: "",
          username: decoded.email.split("@")[0], // Use email prefix as username
          profilePicture: getBaseProfilePictureUrl(decoded.picture), // Store base URL without size
          socials: {
            instagram: "",
            twitter: "",
            facebook: "",
            pinterest: "",
            youtube: "",
            linkedin: "",
          },
        };

        await createUser(googleUser);
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      // Handle error - maybe show a toast or error message
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
    // Handle error - maybe show a toast or error message
  };

  if (user.loading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <div className="pottery-icon">🏺</div>
            <h1 className="logo-title">Potterly</h1>
            <p className="tagline">Track your ceramic journey</p>
          </div>
          <div className="login-content">
            <div className="loading-spinner">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="decorative-element"></div>
          <div className="decorative-element-2"></div>
          <div className="pottery-icon">🏺</div>
          <h1 className="logo-title">Potterly</h1>
          <p className="tagline">Track your ceramic journey</p>
        </div>

        <div className="login-content">
          <h2 className="welcome-text">Welcome to Your Studio</h2>
          <p className="description">
            Join thousands of potters tracking their ceramic pieces from clay to
            finished masterpiece. Start organizing your pottery workflow today.
          </p>

          <div className="login-options">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              text="continue_with"
              shape="rectangular"
              theme="filled_blue"
              size="large"
            />
          </div>

          <div className="feature-highlights">
            <div className="feature-item">
              <div className="feature-icon">🏺</div>
              <span>Track pieces through every stage of creation</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <span>Organize with kanban boards and tables</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔥</div>
              <span>Schedule firings and manage glazing</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <span>Build your pottery portfolio</span>
            </div>
          </div>

          <div className="security-note">
            <span>🔒</span>
            <span>
              Your account is secured with Google authentication. We never store
              your password.
            </span>
          </div>

          {user.error && (
            <div className="error-message">
              <span>⚠️</span>
              <span>{user.error}</span>
            </div>
          )}
        </div>

        <div className="footer-links">
          <a href="#" className="footer-link">
            Privacy Policy
          </a>
          <a href="#" className="footer-link">
            Terms of Service
          </a>
          <a href="#" className="footer-link">
            Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
