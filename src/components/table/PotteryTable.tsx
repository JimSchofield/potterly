import { Link, useNavigate } from "react-router-dom";
import { PotteryPiece } from "../../types/Piece";
import { getStageIcon, getStageLabel } from "../../utils/labels-and-icons";
import { useModal } from "../../contexts/ModalContext";
import { showStageUpdateDialog } from "../StageUpdateDialog";
import { showConfirmDialog } from "../ConfirmDialog";
import { archivePiece } from "../../stores/pieces";

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
      onConfirm: () => {
        archivePiece(piece.id);
      },
    });
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
                    className="action-btn"
                    onClick={() => handleEdit(piece)}
                  >
                    Edit
                  </button>
                  {!piece.archived && (
                    <button
                      className="action-btn"
                      onClick={() =>
                        piece.stage === "finished"
                          ? handleArchive(piece)
                          : handleMove(piece)
                      }
                    >
                      {piece.stage === "finished" ? "Archive" : "Move"}
                    </button>
                  )}
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
