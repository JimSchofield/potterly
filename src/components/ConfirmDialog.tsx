import React from 'react';
import { useModal } from '../contexts/ModalContext';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'info'
}) => {
  const { closeModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    closeModal();
  };

  return (
    <div className="confirm-dialog">
      <div className={`confirm-icon confirm-icon-${type}`}>
        {type === 'danger' && '⚠️'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
      </div>
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions">
        <button 
          className="btn btn-secondary" 
          onClick={handleCancel}
        >
          {cancelText}
        </button>
        <button 
          className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

// Helper function to show confirm dialog
export const showConfirmDialog = (
  openModal: (props: any) => void,
  options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    type?: 'danger' | 'warning' | 'info';
  }
) => {
  openModal({
    title: options.title,
    size: 'sm',
    children: (
      <ConfirmDialog
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        onConfirm={options.onConfirm}
        onCancel={options.onCancel}
        type={options.type}
      />
    )
  });
};

export default ConfirmDialog;