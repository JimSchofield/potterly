import { Link, useNavigate } from "react-router-dom";
import { PotteryPiece } from "../../types/Piece";
import { getStageIcon, getStageLabel } from "../../utils/labels-and-icons";
import { useModal } from "../../contexts/ModalContext";
import { showStageUpdateDialog } from "../StageUpdateDialog";
import { showConfirmDialog } from "../ConfirmDialog";
import { archivePiece, updatePiece } from "../../stores/pieces";

interface PotteryTableProps {
  pieces: PotteryPiece[];
  onEdit?: (piece: PotteryPiece) => void;
  onMove?: (piece: PotteryPiece) => void;
  onArchive?: (piece: PotteryPiece) => void;
}

const PotteryTable = ({ pieces }: PotteryTableProps) => {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleEdit = (piece: PotteryPiece) => {
    navigate(`/piece/${piece.id}?edit=true`);
  };

  const handleMove = (piece: PotteryPiece) => {
    showStageUpdateDialog(openModal, piece);
  };

  const handleArchive = (piece: PotteryPiece) => {
    showConfirmDialog(openModal, {
      title: "Archive Pottery Piece",
      message: `Are you sure you want to archive "${piece.title}"? This will remove it from the active workflow but keep it in your collection.`,
      confirmText: "Archive",
      cancelText: "Cancel",
      type: "warning",
      onConfirm: async () => {
        try {
          await archivePiece(piece.id);
        } catch (error) {
          console.error("Failed to archive piece:", error);
        }
      },
    });
  };

  const handleUnarchive = (piece: PotteryPiece) => {
    showConfirmDialog(openModal, {
      title: "Unarchive Pottery Piece",
      message: `Are you sure you want to unarchive "${piece.title}"? This will make it visible in your active projects again.`,
      confirmText: "Unarchive",
      cancelText: "Cancel",
      type: "info",
      onConfirm: async () => {
        try {
          await updatePiece(piece.id, { archived: false });
        } catch (error) {
          console.error("Failed to unarchive piece:", error);
        }
      },
    });
  };

  const handleToggleStar = async (piece: PotteryPiece) => {
    try {
      await updatePiece(piece.id, { starred: !piece.starred });
    } catch (error) {
      console.error("Failed to toggle starred status:", error);
    }
  };

  return (
    <div className="table-content">
      <table className="pottery-table">
        <thead>
          <tr>
            <th>Piece</th>
            <th>Stage</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pieces.map((piece) => (
            <tr key={piece.id}>
              <td>
                <div className="piece-info">
                  <div className="piece-name">
                    {piece.starred && <span className="star-icon">⭐</span>}
                    <Link
                      to={`/piece/${piece.id}`}
                      className="piece-title-link"
                    >
                      {piece.title}
                    </Link>
                    {piece.archived && (
                      <span className="archived-badge">Archived</span>
                    )}
                  </div>
                  <div className="piece-type">{piece.type}</div>
                </div>
              </td>
              <td>
                <div className={`stage-badge stage-${piece.stage}`}>
                  {getStageIcon(piece.stage)} {getStageLabel(piece.stage)}
                </div>
              </td>
              <td>
                <div className="description">{piece.details}</div>
              </td>
              <td>
                <div className="priority-indicator">
                  <div
                    className={`priority-dot priority-${piece.priority}`}
                  ></div>
                  <span>
                    {piece.priority.charAt(0).toUpperCase() +
                      piece.priority.slice(1)}
                  </span>
                </div>
              </td>
              <td>
                <div className="status-info">{piece.status || "—"}</div>
              </td>
              <td>
                <div className="actions">
                  <button
                    className={`action-btn star-action ${piece.starred ? 'starred' : 'unstarred'}`}
                    onClick={() => handleToggleStar(piece)}
                    title={piece.starred ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {piece.starred ? '⭐' : '☆'}
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => handleEdit(piece)}
                  >
                    Edit
                  </button>
                  {!piece.archived && (
                    <button
                      className="action-btn"
                      onClick={() => handleMove(piece)}
                    >
                      Move
                    </button>
                  )}
                  <button
                    className="action-btn"
                    onClick={() => piece.archived ? handleUnarchive(piece) : handleArchive(piece)}
                  >
                    {piece.archived ? "Unarchive" : "Archive"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PotteryTable;
