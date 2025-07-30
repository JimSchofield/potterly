import { useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { piecesStore } from "../stores/pieces";
import "./PieceDetail.css";

const PieceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const pieces = useStore(piecesStore);
  
  const piece = pieces.find(p => p.id === id);

  if (!piece) {
    return (
      <div className="piece-detail-container">
        <div className="piece-not-found">
          <h1>Piece Not Found</h1>
          <p>The pottery piece you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="piece-detail-container">
      <div className="piece-detail-header">
        <h1>{piece.title}</h1>
        <div className="piece-meta">
          <span className={`priority-indicator priority-${piece.priority}`}>
            {piece.priority} priority
          </span>
          <span className={`stage-indicator stage-${piece.stage}`}>
            {piece.stage}
          </span>
          {piece.starred && <span className="starred-indicator">⭐ Starred</span>}
          {piece.archived && <span className="archived-indicator">📦 Archived</span>}
        </div>
      </div>

      <div className="piece-detail-content">
        <div className="piece-basic-info">
          <div className="info-section">
            <h3>Basic Information</h3>
            <p><strong>Type:</strong> {piece.type}</p>
            <p><strong>Details:</strong> {piece.details}</p>
            {piece.status && <p><strong>Status:</strong> {piece.status}</p>}
            <p><strong>Created:</strong> {new Date(piece.createdAt).toLocaleDateString()}</p>
            <p><strong>Last Updated:</strong> {new Date(piece.lastUpdated).toLocaleDateString()}</p>
            {piece.dueDate && (
              <p><strong>Due Date:</strong> {new Date(piece.dueDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        <div className="stage-details-section">
          <h3>Stage Details</h3>
          <div className="stages-grid">
            {Object.entries(piece.stageDetails).map(([stageName, stageData]) => (
              <div key={stageName} className={`stage-card stage-${stageName} ${piece.stage === stageName ? 'current-stage' : ''}`}>
                <h4>{stageName.charAt(0).toUpperCase() + stageName.slice(1)}</h4>
                {'weight' in stageData && stageData.weight && (
                  <div className="stage-weight">
                    <strong>Weight:</strong> {stageData.weight}g
                  </div>
                )}
                {'glazes' in stageData && stageData.glazes && (
                  <div className="stage-glazes">
                    <strong>Glazes:</strong>
                    <p>{stageData.glazes}</p>
                  </div>
                )}
                {stageData.notes && (
                  <div className="stage-notes">
                    <strong>Notes:</strong>
                    <p>{stageData.notes}</p>
                  </div>
                )}
                {stageData.imageUrl && (
                  <div className="stage-image">
                    <img src={stageData.imageUrl} alt={`${stageName} stage`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieceDetail;