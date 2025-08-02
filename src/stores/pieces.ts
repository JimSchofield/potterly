import { atom, computed } from "nanostores";
import { PotteryPiece, StageData, ThrowStageData, GlazeStageData } from "../types/Piece";
import { createPieceAPI, getPieceWithStagesAPI, getUserPiecesAPI, updateStageDetailAPI, updatePieceAPI } from "../network/pieces";

// Initialize the store with empty array - will be populated with user data
export const piecesStore = atom<PotteryPiece[]>([]);

// Filter state
interface FilterState {
  stage: string;
  type: string;
  priority: string;
  search: string;
  showArchived: boolean;
  showStarredOnly: boolean;
}

export const filtersStore = atom<FilterState>({
  stage: "",
  type: "",
  priority: "",
  search: "",
  showArchived: false,
  showStarredOnly: false,
});

// Actions
export const loadUserPieces = async (userId: string) => {
  try {
    const userPieces = await getUserPiecesAPI(userId);
    piecesStore.set(userPieces);
    return userPieces;
  } catch (error) {
    console.error("Error loading user pieces:", error);
    // Keep empty array on error
    piecesStore.set([]);
    throw error;
  }
};

export const addPiece = async (piece: PotteryPiece) => {
  try {
    // Check if piece already exists in store (prevents duplicates from React Strict Mode)
    const currentPieces = piecesStore.get();
    const existingPiece = currentPieces.find(p => p.id === piece.id);
    
    if (existingPiece) {
      console.log("Piece already exists in store, skipping add");
      return existingPiece;
    }

    // Add to database first
    const savedPiece = await createPieceAPI(piece);

    // Update local store with the piece returned from database
    const updatedPieces = piecesStore.get();
    const stillExists = updatedPieces.find(p => p.id === savedPiece.id);
    
    if (!stillExists) {
      piecesStore.set([...updatedPieces, savedPiece]);
    }

    return savedPiece;
  } catch (error) {
    console.error("Error adding piece:", error);
    throw error;
  }
};

export const updatePiece = async (
  id: string,
  updates: Partial<Omit<PotteryPiece, "id">>,
) => {
  try {
    // Update in database first
    const updatedPiece = await updatePieceAPI(id, {
      ...updates,
      lastUpdated: new Date().toISOString(),
    });

    // Update local store with the piece returned from database, preserving stage details
    const currentPieces = piecesStore.get();
    const updatedPieces = currentPieces.map((piece) =>
      piece.id === id 
        ? {
            ...updatedPiece,
            // Preserve existing stage details since API response doesn't include them
            stageDetails: piece.stageDetails,
          }
        : piece,
    );
    piecesStore.set(updatedPieces);

    return updatedPiece;
  } catch (error) {
    console.error("Error updating piece:", error);
    throw error;
  }
};

export const updateStageDetail = async (
  pieceId: string,
  stage: string,
  stageData: StageData | ThrowStageData | GlazeStageData
) => {
  try {
    // Update in database first
    await updateStageDetailAPI(pieceId, stage, stageData);

    // Update local store
    const currentPieces = piecesStore.get();
    const updatedPieces = currentPieces.map((piece) =>
      piece.id === pieceId
        ? {
            ...piece,
            stageDetails: {
              ...piece.stageDetails,
              [stage]: stageData,
            },
            lastUpdated: new Date().toISOString(),
          }
        : piece,
    );
    piecesStore.set(updatedPieces);
  } catch (error) {
    console.error("Error updating stage detail:", error);
    throw error;
  }
};

export const removePiece = (id: string) => {
  const currentPieces = piecesStore.get();
  const filteredPieces = currentPieces.filter((piece) => piece.id !== id);
  piecesStore.set(filteredPieces);
};

export const archivePiece = async (id: string) => {
  try {
    await updatePiece(id, { archived: true });
  } catch (error) {
    console.error("Error archiving piece:", error);
    throw error;
  }
};

export const unarchivePiece = async (id: string) => {
  try {
    await updatePiece(id, { archived: false });
  } catch (error) {
    console.error("Error unarchiving piece:", error);
    throw error;
  }
};

export const getPiecesByStage = (stage: string) => {
  const pieces = piecesStore.get();
  return pieces.filter((piece) => piece.stage === stage);
};

export const getPieceById = async (id: string) => {
  // First check if piece is in store memory
  const pieces = piecesStore.get();
  const pieceInStore = pieces.find((piece) => piece.id === id);

  if (pieceInStore) {
    return pieceInStore;
  }

  // If not in store, fetch from database with stages
  try {
    const pieceWithStages = await getPieceWithStagesAPI(id);

    if (pieceWithStages) {
      // Add to store for future use
      const currentPieces = piecesStore.get();
      piecesStore.set([...currentPieces, pieceWithStages]);
    }

    return pieceWithStages;
  } catch (error) {
    console.error("Error fetching piece:", error);
    return null;
  }
};

// Filter actions
export const setStageFilter = (stage: string) => {
  const currentFilters = filtersStore.get();
  filtersStore.set({ ...currentFilters, stage });
};

export const setTypeFilter = (type: string) => {
  const currentFilters = filtersStore.get();
  filtersStore.set({ ...currentFilters, type });
};

export const setPriorityFilter = (priority: string) => {
  const currentFilters = filtersStore.get();
  filtersStore.set({ ...currentFilters, priority });
};

export const setSearchFilter = (search: string) => {
  const currentFilters = filtersStore.get();
  filtersStore.set({ ...currentFilters, search });
};

export const setShowArchivedFilter = (showArchived: boolean) => {
  const currentFilters = filtersStore.get();
  filtersStore.set({ ...currentFilters, showArchived });
};

export const setShowStarredOnlyFilter = (showStarredOnly: boolean) => {
  const currentFilters = filtersStore.get();
  filtersStore.set({ ...currentFilters, showStarredOnly });
};

export const clearFilters = () => {
  filtersStore.set({
    stage: "",
    type: "",
    priority: "",
    search: "",
    showArchived: false,
    showStarredOnly: false,
  });
};

// Computed store for filtered pieces
export const filteredPiecesStore = computed(
  [piecesStore, filtersStore],
  (pieces, filters) => {
    let filtered = [...pieces];

    // Filter by archived status
    if (!filters.showArchived) {
      filtered = filtered.filter((piece) => !piece.archived);
    }

    // Filter by starred status
    if (filters.showStarredOnly) {
      filtered = filtered.filter((piece) => piece.starred);
    }

    // Filter by stage
    if (filters.stage) {
      filtered = filtered.filter((piece) => piece.stage === filters.stage);
    }

    // Filter by type (case insensitive)
    if (filters.type) {
      filtered = filtered.filter((piece) =>
        piece.type.toLowerCase().includes(filters.type.toLowerCase()),
      );
    }

    // Filter by priority
    if (filters.priority) {
      filtered = filtered.filter(
        (piece) => piece.priority === filters.priority,
      );
    }

    // Filter by search (searches title and details)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (piece) =>
          piece.title.toLowerCase().includes(searchLower) ||
          piece.details.toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  },
);

// Enhanced getPiecesByStage that respects filters
export const getFilteredPiecesByStage = (stage: string) => {
  const filteredPieces = filteredPiecesStore.get();
  const priorityOrder = { high: 3, medium: 2, low: 1 };

  return filteredPieces
    .filter((piece) => piece.stage === stage)
    .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
};
