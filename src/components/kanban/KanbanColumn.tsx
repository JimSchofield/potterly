import PotteryCard from "./PotteryCard";
import AddCardButton from "./AddCardButton";
import { PotteryPiece, Stages } from "../../types/Piece";
import "./KanbanColumn.css";
import { useDrop } from "react-dnd";
import { updatePiece } from "../../stores/pieces";
import { setLoading } from "../../stores/loading";

interface KanbanColumnProps {
  stage: string;
  icon: string;
  title: string;
  pieces: PotteryPiece[];
  addButtonText: string;
}

const KanbanColumn = ({
  stage,
  icon,
  title,
  pieces,
  addButtonText,
}: KanbanColumnProps) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'pottery-piece',
    drop: async (item: { id: string; stage: string }) => {
      if (item.stage !== stage) {
        try {
          setLoading(true);
          // Update the piece's stage when dropped on a different column
          await updatePiece(item.id, { stage: stage as Stages });
        } catch (error) {
          console.error("Failed to update piece stage:", error);
        } finally {
          setLoading(false);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
    <div 
      ref={drop}
      className={`column ${stage} ${isActive ? 'drop-active' : ''} ${isOver ? 'drop-over' : ''}`}
    >
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
            id={piece.id}
            title={piece.title}
            type={piece.type}
            details={piece.details}
            status={piece.status}
            stage={piece.stage}
            priority={piece.priority}
            archived={piece.archived}
            starred={piece.starred}
            createdAt={piece.createdAt}
            lastUpdated={piece.lastUpdated}
            dueDate={piece.dueDate}
          />
        ))}
      </div>
      <AddCardButton text={addButtonText} stage={stage} />
    </div>
  );
};

export default KanbanColumn;
