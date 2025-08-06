import { User } from "../types/User";

export const createUserAPI = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.statusText}`);
  }

  return response.json();
};

export const getUserProfileAPI = async (userId: string): Promise<User | null> => {
  const response = await fetch(`/api/users?id=${userId}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  return response.json();
};

export const getUserByGoogleIdAPI = async (googleId: string): Promise<User | null> => {
  const response = await fetch(`/api/users?googleId=${googleId}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch user by Google ID: ${response.statusText}`);
  }

  return response.json();
};

export const getUserByUsernameAPI = async (username: string): Promise<User | null> => {
  const response = await fetch(`/api/users?username=${encodeURIComponent(username)}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch user by username: ${response.statusText}`);
  }

  return response.json();
};

export const updateUserProfileAPI = async (userId: string, updates: Partial<Omit<User, 'id'>>): Promise<User> => {
  const response = await fetch(`/api/users?id=${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user profile: ${response.statusText}`);
  }

  return response.json();
};

export interface UserStats {
  totalPieces: number;
  activePieces: number;
  completedPieces: number;
  starredPieces: number;
  archivedPieces: number;
  piecesByStage: {
    ideas: number;
    throw: number;
    trim: number;
    bisque: number;
    glaze: number;
    finished: number;
  };
  piecesByPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

export const getUserStatsAPI = async (userId: string): Promise<UserStats> => {
  const response = await fetch(`/api/user-stats?userId=${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user statistics: ${response.statusText}`);
  }

  return response.json();
};