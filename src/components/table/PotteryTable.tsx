import { Link } from "react-router-dom";
import { PotteryPiece } from "../../types/Piece";
import { getStageIcon, getStageLabel } from "../../utils/labels-and-icons";

interface PotteryTableProps {
  pieces: PotteryPiece[];
  onEdit?: (piece: PotteryPiece) => void;
  onMove?: (piece: PotteryPiece) => void;
  onArchive?: (piece: PotteryPiece) => void;
}

const PotteryTable = ({
  pieces,
  onEdit,
  onMove,
  onArchive,
}: PotteryTableProps) => {
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
                    <Link to={`/piece/${piece.id}`} className="piece-title-link">
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
                <div className="status-info">{piece.status || '—'}</div>
              </td>
              <td>
                <div className="actions">
                  <button
                    className="action-btn"
                    onClick={() => onEdit?.(piece)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn"
                    onClick={() =>
                      piece.stage === "finished"
                        ? onArchive?.(piece)
                        : onMove?.(piece)
                    }
                  >
                    {piece.stage === "finished" ? "Archive" : "Move"}
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

