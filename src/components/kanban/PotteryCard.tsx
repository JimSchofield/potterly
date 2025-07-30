import { Link } from "react-router-dom";
import "./PotteryCard.css";

interface PotteryCardProps {
  id: string;
  title: string;
  type: string;
  details: string;
  status?: string;
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
  lastUpdated,
  dueDate,
}: PotteryCardProps) => {
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
    <div className="pottery-card">
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
      <div className="card-details">{details}</div>
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
