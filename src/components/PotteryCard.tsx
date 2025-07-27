import './PotteryCard.css'

interface PotteryCardProps {
  title: string;
  type: string;
  details: string;
  date: string;
  priority: "high" | "medium" | "low";
  createdAt?: string;
  lastUpdated?: string;
  dueDate?: string;
}

const PotteryCard = ({
  title,
  type,
  details,
  date,
  priority,
  createdAt,
  lastUpdated,
  dueDate,
}: PotteryCardProps) => {
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }
  return (
    <div className="pottery-card">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          <div className="card-type">{type}</div>
        </div>
      </div>
      <div className="card-details">{details}</div>
      <div className="card-meta">
        <div className="card-dates">
          <div className="card-date">📅 {date}</div>
          {dueDate && (
            <div className="card-due-date">🎯 Due: {formatDate(dueDate)}</div>
          )}
          {createdAt && (
            <div className="card-created">📝 Created: {formatDate(createdAt)}</div>
          )}
          {lastUpdated && lastUpdated !== createdAt && (
            <div className="card-updated">🔄 Updated: {formatDate(lastUpdated)}</div>
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

