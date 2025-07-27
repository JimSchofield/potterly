import "./TableView.css";
import { useStore } from "@nanostores/react";
import { filteredPiecesStore, piecesStore } from "../../stores/pieces";
import Filters from "../Filters";
import PotteryTable from "./PotteryTable";
import TableStats from "./TableStats";

const TableView = () => {
  const filteredPieces = useStore(filteredPiecesStore);
  const allPieces = useStore(piecesStore);

  // Stats based on all pieces (not filtered)
  const stats = {
    total: allPieces.length,
    inProgress: allPieces.filter((p) => p.stage !== "finished").length,
    highPriority: allPieces.filter((p) => p.priority === "high").length,
    completed: allPieces.filter((p) => p.stage === "finished").length,
  };

  return (
    <div className="table-view-container">
      <Filters />

      <PotteryTable pieces={filteredPieces} />

      <TableStats
        total={stats.total}
        inProgress={stats.inProgress}
        highPriority={stats.highPriority}
        completed={stats.completed}
      />
    </div>
  );
};

export default TableView;

