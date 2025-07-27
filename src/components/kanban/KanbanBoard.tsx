import "./KanbanBoard.css";
import KanbanColumn from "./KanbanColumn";
import { useStore } from "@nanostores/react";
import { piecesStore } from "../../stores/pieces";
import { Stages } from "../../types/Piece";

interface StageConfig {
  key: Stages;
  icon: string;
  title: string;
  addButtonText: string;
}

const KanbanBoard = () => {
  const pieces = useStore(piecesStore);

  const getPiecesByStage = (stage: string) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return pieces
      .filter((piece) => piece.stage === stage)
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  };

  const stages: StageConfig[] = [
    { key: "ideas", icon: "💡", title: "Ideas", addButtonText: "+ Add new idea" },
    { key: "throw", icon: "🏺", title: "Throw", addButtonText: "+ Add piece to throw" },
    { key: "trim", icon: "🔧", title: "Trim", addButtonText: "+ Add piece to trim" },
    { key: "bisque", icon: "🔥", title: "Bisque", addButtonText: "+ Add to bisque queue" },
    { key: "glaze", icon: "🎨", title: "Glaze", addButtonText: "+ Add to glaze queue" },
    { key: "finished", icon: "✨", title: "Finished", addButtonText: "+ Archive completed piece" },
  ];
  return (
    <div className="kanban-container">
      <div className="kanban-board">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.key}
            stage={stage.key}
            icon={stage.icon}
            title={stage.title}
            pieces={getPiecesByStage(stage.key)}
            addButtonText={stage.addButtonText}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
