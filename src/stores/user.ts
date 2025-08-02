import { atom } from "nanostores";
import { User } from "../types/User";
import { createUserAPI, getUserProfileAPI, updateUserProfileAPI, getUserByGoogleIdAPI } from "../network/users";
import { loadUserPieces, piecesStore } from "./pieces";

// User store state
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initialize user store
export const userStore = atom<UserState>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
});

// Actions
export const setLoading = (loading: boolean) => {
  const currentState = userStore.get();
  userStore.set({ ...currentState, loading });
};

export const setError = (error: string | null) => {
  const currentState = userStore.get();
  userStore.set({ ...currentState, error });
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  setLoading(true);
  setError(null);

  try {
    const newUser = await createUserAPI(userData);
    
    // Set user as authenticated
    userStore.set({
      user: newUser,
      isAuthenticated: true,
      loading: false,
      error: null,
    });

    // Load user's pieces (will be empty for new user)
    try {
      await loadUserPieces(newUser.id);
    } catch (piecesError) {
      console.error("Failed to load user pieces:", piecesError);
      // Don't fail the login if pieces can't be loaded
    }

    return newUser;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    setError(errorMessage);
    setLoading(false);
    throw error;
  }
};

export const loginUser = async (userId: string) => {
  setLoading(true);
  setError(null);

  try {
    const userProfile = await getUserProfile(userId);
    
    if (userProfile) {
      userStore.set({
        user: userProfile,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      // Load user's pieces
      try {
        await loadUserPieces(userProfile.id);
      } catch (piecesError) {
        console.error("Failed to load user pieces:", piecesError);
        // Don't fail the login if pieces can't be loaded
      }

      return userProfile;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to login user';
    setError(errorMessage);
    setLoading(false);
    throw error;
  }
};

export const loginUserByGoogleId = async (googleId: string) => {
  setLoading(true);
  setError(null);

  try {
    const userProfile = await getUserByGoogleIdAPI(googleId);
    
    if (userProfile) {
      userStore.set({
        user: userProfile,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      // Load user's pieces
      try {
        await loadUserPieces(userProfile.id);
      } catch (piecesError) {
        console.error("Failed to load user pieces:", piecesError);
        // Don't fail the login if pieces can't be loaded
      }

      return userProfile;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to login user';
    setError(errorMessage);
    setLoading(false);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    return await getUserProfileAPI(userId);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<Omit<User, 'id'>>) => {
  setLoading(true);
  setError(null);

  try {
    const updatedUser = await updateUserProfileAPI(userId, updates);
    
    // Update user in store
    const currentState = userStore.get();
    userStore.set({
      ...currentState,
      user: updatedUser,
      loading: false,
      error: null,
    });

    return updatedUser;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user profile';
    setError(errorMessage);
    setLoading(false);
    throw error;
  }
};

export const logoutUser = () => {
  userStore.set({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  });

  // Clear pieces store on logout
  piecesStore.set([]);
};

// Helper function to get current user
export const getCurrentUser = (): User | null => {
  return userStore.get().user;
};

// Helper function to check if user is authenticated
export const isUserAuthenticated = (): boolean => {
  return userStore.get().isAuthenticated;
};

// Get current user ID (useful for pieces)
export const getCurrentUserId = (): string | null => {
  const user = getCurrentUser();
  return user ? user.id : null;
};