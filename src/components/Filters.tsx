import { useStore } from "@nanostores/react";
import {
  getAllStages,
  getStageIcon,
  getStageLabel,
} from "../utils/labels-and-icons";
import { pieceTypes } from "../utils/piece-types";
import {
  filtersStore,
  setStageFilter,
  setTypeFilter,
  setPriorityFilter,
  setSearchFilter,
  setShowArchivedFilter,
  setShowStarredOnlyFilter,
} from "../stores/pieces";
import "./Filters.css";

interface FiltersProps {
  onAddNew?: () => void;
}

const Filters = ({ onAddNew }: FiltersProps) => {
  const stages = getAllStages();
  const filters = useStore(filtersStore);

  return (
    <div className="filter-controls">
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="stage-filter">Stage:</label>
          <select
            id="stage-filter"
            className="filter-select"
            value={filters.stage}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="">All Stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {getStageIcon(stage)} {getStageLabel(stage)}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="type-filter">Type:</label>
          <select
            id="type-filter"
            className="filter-select"
            value={filters.type}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {pieceTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="priority-filter">Priority:</label>
          <select
            id="priority-filter"
            className="filter-select"
            value={filters.priority}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.showArchived}
              onChange={(e) => setShowArchivedFilter(e.target.checked)}
              className="filter-checkbox"
            />
            <span>Show Archived</span>
          </label>
        </div>
        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.showStarredOnly}
              onChange={(e) => setShowStarredOnlyFilter(e.target.checked)}
              className="filter-checkbox"
            />
            <span>⭐ Starred Only</span>
          </label>
        </div>
      </div>
      <div className="search-and-add">
        <input
          type="text"
          className="search-box"
          placeholder="Search pieces..."
          value={filters.search}
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <button className="add-btn" onClick={onAddNew}>
          + Add New Piece
        </button>
      </div>
    </div>
  );
};

export default Filters;
