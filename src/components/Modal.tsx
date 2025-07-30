import React, { useEffect, useRef } from 'react';
import { useModal, ModalProps } from '../contexts/ModalContext';
import './Modal.css';

const Modal: React.FC = () => {
  const { isOpen, modalProps, closeModal } = useModal();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    
    if (!dialog) return;

    if (isOpen && modalProps) {
      dialog.showModal();
    } else {
      dialog.close();
    }

    // Handle native dialog close event (ESC key, clicking backdrop)
    const handleClose = () => {
      closeModal();
    };

    // Handle clicking the backdrop (outside the dialog content)
    const handleClick = (event: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      
      if (!isInDialog) {
        closeModal();
      }
    };

    if (isOpen) {
      dialog.addEventListener('close', handleClose);
      dialog.addEventListener('click', handleClick);
    }

    return () => {
      if (dialog) {
        dialog.removeEventListener('close', handleClose);
        dialog.removeEventListener('click', handleClick);
      }
    };
  }, [isOpen, modalProps, closeModal]);

  if (!modalProps) {
    return null;
  }

  return (
    <dialog 
      ref={dialogRef} 
      className={`modal-dialog modal-${modalProps.size}`}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{modalProps.title}</h2>
          {modalProps.showCloseButton && (
            <button 
              className="modal-close-btn" 
              onClick={closeModal}
              aria-label="Close modal"
            >
              ✕
            </button>
          )}
        </div>
        <div className="modal-body">
          {modalProps.children}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;