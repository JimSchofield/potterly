import "./Design.css";
import KanbanBoard from "../../components/kanban/KanbanBoard";

const Design = () => {
  return (
    <div className="design-page">
      <div className="header">
        <h1>🏺 Pottery Studio Dashboard</h1>
        <p>Track your ceramic pieces through every stage of creation</p>
      </div>

      <KanbanBoard />
    </div>
  );
};

export default Design;
