import { atom } from "nanostores";

// Global loading state for operations that should block user interaction
export const isLoadingStore = atom<boolean>(false);

export const setLoading = (loading: boolean) => {
  isLoadingStore.set(loading);
};