/**
 * Utilities for persisting data to localStorage with error handling
 */

const STORAGE_KEYS = {
  USER_STATE: 'potterly_user_state',
} as const;

/**
 * Safely save data to localStorage with error handling
 */
export const saveToStorage = <T>(key: string, data: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
    return false;
  }
};

/**
 * Safely load data from localStorage with error handling
 */
export const loadFromStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return null;
  }
};

/**
 * Safely remove data from localStorage
 */
export const removeFromStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
    return false;
  }
};

/**
 * Clear all Potterly data from localStorage
 */
export const clearPotterlyStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
};

/**
 * Types for persisted user state
 */
interface PersistedUserState {
  user: Record<string, unknown>; // Generic object type to avoid circular imports
  isAuthenticated: boolean;
  timestamp: number; // When the session was saved
}

// Session expiry time: 30 days
const SESSION_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * User state persistence functions
 */
export const saveUserState = (userState: PersistedUserState) => {
  return saveToStorage(STORAGE_KEYS.USER_STATE, userState);
};

export const loadUserState = (): PersistedUserState | null => {
  const state = loadFromStorage<PersistedUserState>(STORAGE_KEYS.USER_STATE);
  
  // Check if session has expired
  if (state && state.timestamp) {
    const now = Date.now();
    if (now - state.timestamp > SESSION_EXPIRY_MS) {
      console.log('User session expired, clearing localStorage');
      clearUserState();
      return null;
    }
  }
  
  return state;
};

export const clearUserState = () => {
  return removeFromStorage(STORAGE_KEYS.USER_STATE);
};

/**
 * Check if localStorage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};