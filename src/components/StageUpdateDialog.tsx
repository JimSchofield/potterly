import React, { useState } from 'react';
import { PotteryPiece, Stages } from '../types/Piece';
import { useModal } from '../contexts/ModalContext';
import { updatePiece } from '../stores/pieces';
import { getAllStages, getStageIcon, getStageLabel } from '../utils/labels-and-icons';
import './StageUpdateDialog.css';

interface StageUpdateDialogProps {
  piece: PotteryPiece;
}

const StageUpdateDialog: React.FC<StageUpdateDialogProps> = ({ piece }) => {
  const { closeModal } = useModal();
  const [selectedStage, setSelectedStage] = useState<Stages>(piece.stage);
  const stages = getAllStages();

  const handleConfirm = () => {
    if (selectedStage !== piece.stage) {
      updatePiece(piece.id, { stage: selectedStage });
    }
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className="stage-update-dialog">
      <div className="current-piece-info">
        <h3>{piece.title}</h3>
        <p className="piece-type">{piece.type}</p>
        <div className="current-stage">
          <span className="stage-label">Current Stage:</span>
          <span className={`badge stage-badge stage-${piece.stage}`}>
            {getStageIcon(piece.stage)} {getStageLabel(piece.stage)}
          </span>
        </div>
      </div>

      <div className="form-selection">
        <label htmlFor="form-select" className="form-select-label">
          <strong>Move to Stage:</strong>
        </label>
        <select
          id="form-select"
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value as Stages)}
          className="form-select"
        >
          {stages.map((stage) => (
            <option key={stage} value={stage}>
              {getStageIcon(stage)} {getStageLabel(stage)}
            </option>
          ))}
        </select>
      </div>

      <div className="stage-update-actions">
        <button 
          className="btn btn-secondary" 
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleConfirm}
          disabled={selectedStage === piece.stage}
        >
          Update Stage
        </button>
      </div>
    </div>
  );
};

// Helper function to show stage update dialog
export const showStageUpdateDialog = (
  openModal: (props: any) => void,
  piece: PotteryPiece
) => {
  openModal({
    title: 'Update Pottery Stage',
    size: 'sm',
    children: <StageUpdateDialog piece={piece} />
  });
};

export default StageUpdateDialog;