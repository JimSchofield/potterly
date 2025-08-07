import { atom } from "nanostores";

// Global loading state for operations that should block user interaction
export const isLoadingStore = atom<boolean>(false);
export const loadingMessageStore = atom<string>("Loading...");

export const setLoading = (loading: boolean, message?: string) => {
  isLoadingStore.set(loading);
  if (message) {
    loadingMessageStore.set(message);
  } else {
    loadingMessageStore.set("Loading...");
  }
};