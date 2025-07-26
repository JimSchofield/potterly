import './PotteryCard.css'

interface PotteryCardProps {
  title: string;
  type: string;
  details: string;
  date: string;
  priority: "high" | "medium" | "low";
  priorityLabel?: string;
}

const PotteryCard = ({
  title,
  type,
  details,
  date,
  priority,
  priorityLabel,
}: PotteryCardProps) => {
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
        <div className="card-date">📅 {date}</div>
        <div>
          <span className={`priority-dot priority-${priority}`}></span>{" "}
          {priorityLabel ||
            priority.charAt(0).toUpperCase() + priority.slice(1)}
        </div>
      </div>
    </div>
  );
};

export default PotteryCard;

