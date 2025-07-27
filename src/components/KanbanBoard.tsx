import "./KanbanBoard.css";
import PotteryCard from "./PotteryCard";
import { useStore } from "@nanostores/react";
import { piecesStore } from "../stores/pieces";

const KanbanBoard = () => {
  const pieces = useStore(piecesStore);

  const getPiecesByStage = (stage: string) => {
    return pieces.filter((piece) => piece.stage === stage);
  };
  return (
    <div className="kanban-container">
      <div className="kanban-board">
        {/* Ideas Column */}
        <div className="column ideas">
          <div className="column-header">
            <div className="column-title">
              <span className="stage-icon">💡</span>
              Ideas
            </div>
            <div className="column-count">
              {getPiecesByStage("ideas").length}
            </div>
          </div>
          <div className="card-list">
            {getPiecesByStage("ideas").map((piece) => (
              <PotteryCard
                key={piece.id}
                title={piece.title}
                type={piece.type}
                details={piece.details}
                date={piece.date}
                priority={piece.priority}
              />
            ))}
          </div>
          <button className="add-card-btn">+ Add new idea</button>
        </div>

        {/* Throw Column */}
        <div className="column throw">
          <div className="column-header">
            <div className="column-title">
              <span className="stage-icon">🏺</span>
              Throw
            </div>
            <div className="column-count">
              {getPiecesByStage("throw").length}
            </div>
          </div>
          <div className="card-list">
            {getPiecesByStage("throw").map((piece) => (
              <PotteryCard
                key={piece.id}
                title={piece.title}
                type={piece.type}
                details={piece.details}
                date={piece.date}
                priority={piece.priority}
              />
            ))}
          </div>
          <button className="add-card-btn">+ Add piece to throw</button>
        </div>

        {/* Trim Column */}
        <div className="column trim">
          <div className="column-header">
            <div className="column-title">
              <span className="stage-icon">🔧</span>
              Trim
            </div>
            <div className="column-count">
              {getPiecesByStage("trim").length}
            </div>
          </div>
          <div className="card-list">
            {getPiecesByStage("trim").map((piece) => (
              <PotteryCard
                key={piece.id}
                title={piece.title}
                type={piece.type}
                details={piece.details}
                date={piece.date}
                priority={piece.priority}
              />
            ))}
          </div>
          <button className="add-card-btn">+ Add piece to trim</button>
        </div>

        {/* Bisque Column */}
        <div className="column bisque">
          <div className="column-header">
            <div className="column-title">
              <span className="stage-icon">🔥</span>
              Bisque
            </div>
            <div className="column-count">
              {getPiecesByStage("bisque").length}
            </div>
          </div>
          <div className="card-list">
            {getPiecesByStage("bisque").map((piece) => (
              <PotteryCard
                key={piece.id}
                title={piece.title}
                type={piece.type}
                details={piece.details}
                date={piece.date}
                priority={piece.priority}
              />
            ))}
          </div>
          <button className="add-card-btn">+ Add to bisque queue</button>
        </div>

        {/* Glaze Column */}
        <div className="column glaze">
          <div className="column-header">
            <div className="column-title">
              <span className="stage-icon">🎨</span>
              Glaze
            </div>
            <div className="column-count">
              {getPiecesByStage("glaze").length}
            </div>
          </div>
          <div className="card-list">
            {getPiecesByStage("glaze").map((piece) => (
              <PotteryCard
                key={piece.id}
                title={piece.title}
                type={piece.type}
                details={piece.details}
                date={piece.date}
                priority={piece.priority}
              />
            ))}
          </div>
          <button className="add-card-btn">+ Add to glaze queue</button>
        </div>

        {/* Finished Column */}
        <div className="column finished">
          <div className="column-header">
            <div className="column-title">
              <span className="stage-icon">✨</span>
              Finished
            </div>
            <div className="column-count">
              {getPiecesByStage("finished").length}
            </div>
          </div>
          <div className="card-list">
            {getPiecesByStage("finished").map((piece) => (
              <PotteryCard
                key={piece.id}
                title={piece.title}
                type={piece.type}
                details={piece.details}
                date={piece.date}
                priority={piece.priority}
              />
            ))}
          </div>
          <button className="add-card-btn">+ Archive completed piece</button>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
