import { atom } from "nanostores";
import { PotteryPiece } from "../types/Piece";

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

// Helper function to apply filters to a pieces array
export const applyFilters = (pieces: PotteryPiece[], filters: FilterState) => {
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
};

// Helper function to get filtered pieces by stage with priority sorting
export const getFilteredPiecesByStage = (pieces: PotteryPiece[], filters: FilterState, stage: string) => {
  const filteredPieces = applyFilters(pieces, filters);
  const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };

  return filteredPieces
    .filter((piece) => piece.stage === stage)
    .sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
};