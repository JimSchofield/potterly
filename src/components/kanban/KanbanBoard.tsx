import "./KanbanBoard.css";
import KanbanColumn from "./KanbanColumn";
import Filters from "../Filters";
import { useStore } from "@nanostores/react";
import { filteredPiecesStore } from "../../stores/pieces";
import { Stages } from "../../types/Piece";
import {
  getAllStages,
  getStageIcon,
  getStageLabel,
} from "../../utils/labels-and-icons";

interface StageConfig {
  key: Stages;
  icon: string;
  title: string;
  addButtonText: string;
}

const KanbanBoard = () => {
  const pieces = useStore(filteredPiecesStore);

  const getPiecesByStage = (stage: string) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return pieces
      .filter((piece) => piece.stage === stage)
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  };

  const stages: StageConfig[] = getAllStages().map((stage) => ({
    key: stage,
    icon: getStageIcon(stage),
    title: getStageLabel(stage),
    addButtonText: `+ Add ${
      stage === "ideas"
        ? "new idea"
        : stage === "finished"
          ? "Finished Piece"
          : `piece to ${stage}`
    }`,
  }));
  return (
    <div className="kanban-container">
      <Filters />
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
