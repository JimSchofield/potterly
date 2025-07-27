import { useStore } from "@nanostores/react";
import { getAllStages, getStageIcon, getStageLabel } from "../utils/labels-and-icons";
import { 
  filtersStore, 
  setStageFilter, 
  setTypeFilter, 
  setPriorityFilter, 
  setSearchFilter 
} from "../stores/pieces";

interface FiltersProps {
  onAddNew?: () => void;
}

const Filters = ({ onAddNew }: FiltersProps) => {
  const stages = getAllStages();
  const filters = useStore(filtersStore);

  return (
    <div className="table-controls">
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
            {stages.map(stage => (
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
            <option value="functional">Functional</option>
            <option value="decorative">Decorative</option>
            <option value="art">Art Piece</option>
            <option value="service">Service Set</option>
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