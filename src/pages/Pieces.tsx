import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import KanbanBoard from "../components/kanban/KanbanBoard";
import TableView from "../components/table/TableView";
import "./Page.css";
import "./Pieces.css";

const Pieces = () => {
  return (
    <div className="page">
      <div className="pieces-header">
        <h1 className="page__title">🏺 Pottery Pieces</h1>
        <div className="view-tabs">
          <NavLink
            to="/pieces/kanban"
            className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
          >
            📋 Kanban View
          </NavLink>
          <NavLink
            to="/pieces/table"
            className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
          >
            📊 Table View
          </NavLink>
        </div>
      </div>
      <div className="pieces-content">
        <Routes>
          <Route path="/" element={<Navigate to="/pieces/table" replace />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/table" element={<TableView />} />
        </Routes>
      </div>
    </div>
  );
};

export default Pieces;
