import { atom } from "nanostores";
import { User } from "../types/User";
import { createUserAPI, getUserProfileAPI, updateUserProfileAPI, getUserByGoogleIdAPI } from "../network/users";
import { loadUserPieces, piecesStore } from "./pieces";
import { saveUserState, loadUserState, clearUserState, isStorageAvailable } from "../utils/storage";

// User store state
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Validate that the restored user data has required fields
const isValidUser = (user: unknown): user is User => {
  return (
    typeof user === 'object' &&
    user !== null &&
    'id' in user &&
    'email' in user &&
    'firstName' in user &&
    'lastName' in user
  );
};

// Initialize user store with data from localStorage if available
const getInitialUserState = (): UserState => {
  if (isStorageAvailable()) {
    try {
      const savedState = loadUserState();
      if (savedState && savedState.user && savedState.isAuthenticated && isValidUser(savedState.user)) {
        console.log('Restored user session from localStorage');
        return {
          user: savedState.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        };
      } else if (savedState) {
        console.warn('Invalid user data in localStorage, clearing...');
        clearUserState();
      }
    } catch (error) {
      console.error('Error restoring user session:', error);
      clearUserState();
    }
  }
  
  return {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

export const userStore = atom<UserState>(getInitialUserState());

// Helper to update store and persist to localStorage
const updateUserStore = (newState: UserState) => {
  userStore.set(newState);
  
  // Only persist authenticated states
  if (newState.isAuthenticated && newState.user) {
    saveUserState({
      user: newState.user as unknown as Record<string, unknown>, // Type cast for storage
      isAuthenticated: newState.isAuthenticated,
      timestamp: Date.now(), // Add timestamp for session expiry
    });
  } else {
    clearUserState();
  }
};

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
    updateUserStore({
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
      updateUserStore({
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
      updateUserStore({
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
    updateUserStore({
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
  updateUserStore({
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

// Initialize user session on app startup (load pieces if user is restored from localStorage)
export const initializeUserSession = async () => {
  const currentState = userStore.get();
  
  if (currentState.isAuthenticated && currentState.user) {
    console.log('Initializing session for restored user:', currentState.user.email);
    
    // Load user's pieces
    try {
      await loadUserPieces(currentState.user.id);
      console.log('Successfully loaded user pieces from database');
    } catch (error) {
      console.error('Failed to load user pieces during session initialization:', error);
      // Don't logout the user if pieces fail to load, just log the error
    }
  }
};