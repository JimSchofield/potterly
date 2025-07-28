interface TableStatsProps {
  total: number;
  inProgress: number;
  highPriority: number;
  completed: number;
  archived: number;
}

const TableStats = ({ total, inProgress, highPriority, completed, archived }: TableStatsProps) => {
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <div className="stat-number">{total}</div>
        <div className="stat-label">Total Pieces</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{inProgress}</div>
        <div className="stat-label">In Progress</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{highPriority}</div>
        <div className="stat-label">High Priority</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{completed}</div>
        <div className="stat-label">Finished This Week</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{archived}</div>
        <div className="stat-label">Archived</div>
      </div>
    </div>
  );
};

export default TableStats;