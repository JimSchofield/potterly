import { useStore } from "@nanostores/react";
import { isLoadingStore } from "../stores/loading";
import "./LoadingOverlay.css";

const LoadingOverlay = () => {
  const isLoading = useStore(isLoadingStore);

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p className="loading-text">Updating pottery piece...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;