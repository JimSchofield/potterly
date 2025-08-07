import { useStore } from "@nanostores/react";
import { isLoadingStore, loadingMessageStore } from "../stores/loading";
import "./LoadingOverlay.css";

const LoadingOverlay = () => {
  const isLoading = useStore(isLoadingStore);
  const loadingMessage = useStore(loadingMessageStore);

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p className="loading-text">{loadingMessage}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;