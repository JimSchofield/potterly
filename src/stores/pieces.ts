import { atom, computed } from "nanostores";
import { PotteryPiece } from "../types/Piece";
import potteryData from "../../examples/dogfood.json";

// Initialize the store with dogfood data
export const piecesStore = atom<PotteryPiece[]>(potteryData as PotteryPiece[]);

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
export const addPiece = (piece: PotteryPiece) => {
  const currentPieces = piecesStore.get();
  piecesStore.set([...currentPieces, piece]);
};

export const updatePiece = (
  id: string,
  updates: Partial<Omit<PotteryPiece, "id">>,
) => {
  const currentPieces = piecesStore.get();
  const updatedPieces = currentPieces.map((piece) =>
    piece.id === id
      ? {
          ...piece,
          ...updates,
          lastUpdated: new Date().toISOString(),
        }
      : piece,
  );
  piecesStore.set(updatedPieces);
};

export const removePiece = (id: string) => {
  const currentPieces = piecesStore.get();
  const filteredPieces = currentPieces.filter((piece) => piece.id !== id);
  piecesStore.set(filteredPieces);
};

export const archivePiece = (id: string) => {
  const currentPieces = piecesStore.get();
  const updatedPieces = currentPieces.map((piece) =>
    piece.id === id
      ? {
          ...piece,
          archived: true,
          lastUpdated: new Date().toISOString(),
        }
      : piece,
  );
  piecesStore.set(updatedPieces);
};

export const unarchivePiece = (id: string) => {
  const currentPieces = piecesStore.get();
  const updatedPieces = currentPieces.map((piece) =>
    piece.id === id
      ? {
          ...piece,
          archived: false,
          lastUpdated: new Date().toISOString(),
        }
      : piece,
  );
  piecesStore.set(updatedPieces);
};

export const getPiecesByStage = (stage: string) => {
  const pieces = piecesStore.get();
  return pieces.filter((piece) => piece.stage === stage);
};

export const getPieceById = (id: string) => {
  const pieces = piecesStore.get();
  return pieces.find((piece) => piece.id === id);
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
