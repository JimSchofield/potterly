import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { piecesStore, updatePiece, removePiece } from "../stores/pieces";
import { PotteryPiece } from "../types/Piece";
import { useModal } from "../contexts/ModalContext";
import { showConfirmDialog } from "../components/ConfirmDialog";
import "./PieceDetail.css";

const PieceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const pieces = useStore(piecesStore);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPiece, setEditedPiece] = useState<PotteryPiece | null>(null);

  const piece = pieces.find((p) => p.id === id);

  // Check for edit query parameter on mount
  useEffect(() => {
    if (searchParams.get('edit') === 'true' && piece) {
      setIsEditMode(true);
      setEditedPiece({ ...piece });
    }
  }, [searchParams, piece]);

  const handleEditToggle = () => {
    if (!isEditMode) {
      // Enter edit mode - initialize editedPiece
      setEditedPiece({ ...piece! });
      setSearchParams({ edit: 'true' });
    } else {
      // Exit edit mode - remove query parameter
      setSearchParams({});
    }
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    if (editedPiece) {
      updatePiece(editedPiece.id, {
        ...editedPiece,
        lastUpdated: new Date().toISOString(),
      });
      setIsEditMode(false);
      setEditedPiece(null);
      setSearchParams({});
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditedPiece(null);
    setSearchParams({});
  };

  const handleStageFieldUpdate = (stageName: string, field: string, value: any) => {
    setEditedPiece((prev) =>
      prev && prev.stageDetails
        ? {
            ...prev,
            stageDetails: {
              ...prev.stageDetails,
              [stageName]: {
                ...prev.stageDetails[stageName as keyof typeof prev.stageDetails],
                [field]: value,
              },
            },
          }
        : null,
    );
  };

  const handleRemovePiece = () => {
    if (!piece) return;
    
    showConfirmDialog(openModal, {
      title: 'Delete Pottery Piece',
      message: `Are you sure you want to permanently delete "${piece.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        removePiece(piece.id);
        navigate('/pieces');
      }
    });
  };

  const currentPiece = isEditMode ? editedPiece! : piece!;

  if (!piece) {
    return (
      <div className="piece-detail-container">
        <div className="piece-not-found">
          <h1>Piece Not Found</h1>
          <p>
            The pottery piece you're looking for doesn't exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="piece-detail-container">
      <div className="piece-detail-header">
        <div className="header-content">
          <h1>
            {isEditMode ? (
              <input
                type="text"
                value={currentPiece.title}
                onChange={(e) =>
                  setEditedPiece((prev) =>
                    prev ? { ...prev, title: e.target.value } : null,
                  )
                }
                className="title-input"
              />
            ) : (
              currentPiece.title
            )}
          </h1>
          <div className="piece-meta">
            <span className={`badge priority-${currentPiece.priority}`}>
              {currentPiece.priority} priority
            </span>
            <span className={`stage-badge stage-${currentPiece.stage}`}>
              {currentPiece.stage}
            </span>
            {currentPiece.starred && (
              <span className="badge starred-indicator">⭐ Starred</span>
            )}
            {currentPiece.archived && (
              <span className="badge archived-indicator">📦 Archived</span>
            )}
          </div>
        </div>
        <div className="header-actions">
          {isEditMode ? (
            <>
              <button onClick={handleSave} className="btn btn-success">
                💾 Save
              </button>
              <button onClick={handleCancel} className="btn btn-danger">
                ❌ Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEditToggle} className="btn btn-outline">
              ✏️ Edit
            </button>
          )}
        </div>
      </div>

      <div className="piece-detail-content">
        <div className="piece-basic-info">
          <div className="info-section">
            <h3>Basic Information</h3>
            <p>
              <strong>Type:</strong>{" "}
              {isEditMode ? (
                <select
                  value={currentPiece.type}
                  onChange={(e) =>
                    setEditedPiece((prev) =>
                      prev ? { ...prev, type: e.target.value as any } : null,
                    )
                  }
                  className="edit-input"
                >
                  <option value="Functional">Functional</option>
                  <option value="Decorative">Decorative</option>
                  <option value="Art Piece">Art Piece</option>
                  <option value="Set">Set</option>
                  <option value="Test piece">Test piece</option>
                </select>
              ) : (
                currentPiece.type
              )}
            </p>
            <p>
              <strong>Details:</strong>{" "}
              {isEditMode ? (
                <textarea
                  value={currentPiece.details}
                  onChange={(e) =>
                    setEditedPiece((prev) =>
                      prev ? { ...prev, details: e.target.value } : null,
                    )
                  }
                  className="edit-textarea"
                  rows={3}
                />
              ) : (
                currentPiece.details
              )}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {isEditMode ? (
                <input
                  type="text"
                  value={currentPiece.status || ""}
                  onChange={(e) =>
                    setEditedPiece((prev) =>
                      prev ? { ...prev, status: e.target.value } : null,
                    )
                  }
                  className="edit-input"
                  placeholder="Optional status"
                />
              ) : (
                currentPiece.status || "Not set"
              )}
            </p>
            <p>
              <strong>Priority:</strong>{" "}
              {isEditMode ? (
                <select
                  value={currentPiece.priority}
                  onChange={(e) =>
                    setEditedPiece((prev) =>
                      prev
                        ? { ...prev, priority: e.target.value as any }
                        : null,
                    )
                  }
                  className="edit-input"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              ) : (
                currentPiece.priority
              )}
            </p>
            <p>
              <strong>Stage:</strong>{" "}
              {isEditMode ? (
                <select
                  value={currentPiece.stage}
                  onChange={(e) =>
                    setEditedPiece((prev) =>
                      prev ? { ...prev, stage: e.target.value as any } : null,
                    )
                  }
                  className="edit-input"
                >
                  <option value="ideas">Ideas</option>
                  <option value="throw">Throw</option>
                  <option value="trim">Trim</option>
                  <option value="bisque">Bisque</option>
                  <option value="glaze">Glaze</option>
                  <option value="finished">Finished</option>
                </select>
              ) : (
                currentPiece.stage
              )}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(currentPiece.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(currentPiece.lastUpdated).toLocaleDateString()}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {isEditMode ? (
                <input
                  type="date"
                  value={
                    currentPiece.dueDate
                      ? new Date(currentPiece.dueDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditedPiece((prev) =>
                      prev
                        ? {
                            ...prev,
                            dueDate: e.target.value
                              ? new Date(e.target.value).toISOString()
                              : undefined,
                          }
                        : null,
                    )
                  }
                  className="edit-input"
                />
              ) : currentPiece.dueDate ? (
                new Date(currentPiece.dueDate).toLocaleDateString()
              ) : (
                "Not set"
              )}
            </p>
          </div>
        </div>

        <div className="stage-details-section">
          <h3>Stage Details</h3>
          <div className="stages-grid">
            {currentPiece.stageDetails &&
              Object.entries(currentPiece.stageDetails).map(
                ([stageName, stageData]) => (
                  <div
                    key={stageName}
                    className={`stage-card stage-${stageName} ${currentPiece.stage === stageName ? "current-stage" : ""}`}
                  >
                    <h4>
                      {stageName.charAt(0).toUpperCase() + stageName.slice(1)}
                    </h4>
                    {"weight" in stageData && (
                      <div className="stage-weight">
                        <strong>Weight:</strong>{" "}
                        {isEditMode ? (
                          <input
                            type="number"
                            value={stageData.weight || ""}
                            onChange={(e) =>
                              handleStageFieldUpdate(
                                stageName,
                                'weight',
                                e.target.value ? Number(e.target.value) : undefined
                              )
                            }
                            className="edit-input weight-input"
                            placeholder="Weight in grams"
                            min="0"
                          />
                        ) : stageData.weight ? (
                          `${stageData.weight}g`
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                    {"glazes" in stageData && (
                      <div className="stage-glazes">
                        <strong>Glazes:</strong>
                        {isEditMode ? (
                          <textarea
                            value={stageData.glazes || ""}
                            onChange={(e) =>
                              handleStageFieldUpdate(stageName, 'glazes', e.target.value)
                            }
                            className="edit-textarea"
                            placeholder="Glazes used"
                            rows={2}
                          />
                        ) : (
                          <p>{stageData.glazes}</p>
                        )}
                      </div>
                    )}
                    <div className="stage-notes">
                      <strong>Notes:</strong>
                      {isEditMode ? (
                        <textarea
                          value={stageData.notes || ""}
                          onChange={(e) =>
                            handleStageFieldUpdate(stageName, 'notes', e.target.value)
                          }
                          className="edit-textarea"
                          placeholder="Stage notes"
                          rows={3}
                        />
                      ) : (
                        <p>{stageData.notes || "No notes"}</p>
                      )}
                    </div>
                    <div className="stage-image">
                      <strong>Image URL:</strong>
                      {isEditMode ? (
                        <input
                          type="url"
                          value={stageData.imageUrl || ""}
                          onChange={(e) =>
                            handleStageFieldUpdate(stageName, 'imageUrl', e.target.value)
                          }
                          className="edit-input"
                          placeholder="Image URL"
                        />
                      ) : stageData.imageUrl ? (
                        <img
                          src={stageData.imageUrl}
                          alt={`${stageName} stage`}
                        />
                      ) : (
                        <p>No image</p>
                      )}
                    </div>
                  </div>
                ),
              )}
          </div>
        </div>

        {isEditMode && (
          <div className="piece-detail-footer">
            <div className="danger-zone">
              <h3>Danger Zone</h3>
              <p>Permanently delete this pottery piece. This action cannot be undone.</p>
              <button 
                onClick={handleRemovePiece} 
                className="btn btn-danger"
              >
                🗑️ Delete Piece
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PieceDetail;

