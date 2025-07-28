import PotteryCard from "./PotteryCard";
import AddCardButton from "./AddCardButton";
import { PotteryPiece } from "../../types/Piece";
import "./KanbanColumn.css";

interface KanbanColumnProps {
  stage: string;
  icon: string;
  title: string;
  pieces: PotteryPiece[];
  addButtonText: string;
  onAddClick?: () => void;
}

const KanbanColumn = ({
  stage,
  icon,
  title,
  pieces,
  addButtonText,
  onAddClick,
}: KanbanColumnProps) => {
  return (
    <div className={`column ${stage}`}>
      <div className="column-header">
        <div className="column-title">
          <span className="stage-icon">{icon}</span>
          {title}
        </div>
        <div className="column-count">{pieces.length}</div>
      </div>
      <div className="card-list">
        {pieces.map((piece) => (
          <PotteryCard
            key={piece.id}
            title={piece.title}
            type={piece.type}
            details={piece.details}
            date={piece.date}
            priority={piece.priority}
            archived={piece.archived}
            starred={piece.starred}
            createdAt={piece.createdAt}
            lastUpdated={piece.lastUpdated}
            dueDate={piece.dueDate}
          />
        ))}
      </div>
      <AddCardButton text={addButtonText} onClick={onAddClick} />
    </div>
  );
};

export default KanbanColumn;

