import "./TableView.css";
import { useStore } from "@nanostores/react";
import { filteredPiecesStore, piecesStore } from "../../stores/pieces";
import Filters from "../Filters";
import PotteryTable from "./PotteryTable";
import TableStats from "./TableStats";
import { getAllStages } from "../../utils/labels-and-icons";

const TableView = () => {
  const filteredPieces = useStore(filteredPiecesStore);
  const allPieces = useStore(piecesStore);

  // Define stage order for sorting
  const stageOrder = getAllStages();
  const stageOrderMap = Object.fromEntries(
    stageOrder.map((stage, index) => [stage, index])
  );

  // Sort pieces by stage order, then by priority
  const sortedPieces = [...filteredPieces].sort((a, b) => {
    const stageComparison = stageOrderMap[a.stage] - stageOrderMap[b.stage];
    if (stageComparison !== 0) return stageComparison;
    
    // If same stage, sort by priority (high > medium > low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Stats based on all pieces (not filtered)
  const stats = {
    total: allPieces.length,
    inProgress: allPieces.filter((p) => p.stage !== "finished").length,
    highPriority: allPieces.filter((p) => p.priority === "high").length,
    completed: allPieces.filter((p) => p.stage === "finished").length,
    archived: allPieces.filter((p) => p.archived).length,
  };

  return (
    <div className="table-view-container">
      <Filters />

      <PotteryTable pieces={sortedPieces} />

      <TableStats
        total={stats.total}
        inProgress={stats.inProgress}
        highPriority={stats.highPriority}
        completed={stats.completed}
        archived={stats.archived}
      />
    </div>
  );
};

export default TableView;
