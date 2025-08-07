import { Link } from "react-router-dom";
import "./PotteryCard.css";
import { Stages } from "../../types/Piece";
import { useDrag } from "react-dnd";

interface PotteryCardProps {
  id: string;
  title: string;
  type: string;
  details: string;
  status?: string;
  stage: Stages;
  priority: "high" | "medium" | "low";
  archived?: boolean;
  starred?: boolean;
  createdAt?: string;
  lastUpdated?: string;
  dueDate?: string;
}

const PotteryCard = ({
  id,
  title,
  type,
  details,
  status,
  priority,
  archived = false,
  starred = false,
  createdAt,
  stage,
  lastUpdated,
  dueDate,
}: PotteryCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'pottery-piece',
    item: { id, stage },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };
  
  return (
    <div
      ref={drag}
      className={`card card-accent card-interactive card-draggable card-flex accent-${stage} ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="card-header">
        <div>
          <div className="card-title">
            {starred && <span className="star-icon">⭐</span>}
            <Link to={`/piece/${id}`} className="card-title-link">
              {title}
            </Link>
            {archived && <span className="archived-badge">Archived</span>}
          </div>
          <div className="card-type">{type}</div>
        </div>
      </div>
      <div className="card-content">{details}</div>
      <div className="card-meta">
        <div className="card-dates">
          {status && <div className="card-status">📋 {status}</div>}
          {dueDate && (
            <div className="card-due-date">🎯 Due: {formatDate(dueDate)}</div>
          )}
          {createdAt && (
            <div className="card-created">
              📝 Created: {formatDate(createdAt)}
            </div>
          )}
          {lastUpdated && lastUpdated !== createdAt && (
            <div className="card-updated">
              🔄 Updated: {formatDate(lastUpdated)}
            </div>
          )}
        </div>
        <div className="card-priority">
          <span className={`priority-dot priority-${priority}`}></span>{" "}
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </div>
      </div>
    </div>
  );
};

export default PotteryCard;
