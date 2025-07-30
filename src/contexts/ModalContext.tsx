import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
}

interface ModalContextType {
  isOpen: boolean;
  modalProps: ModalProps | null;
  openModal: (props: Omit<ModalProps, 'onClose'>) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<ModalProps | null>(null);

  const openModal = (props: Omit<ModalProps, 'onClose'>) => {
    setModalProps({
      ...props,
      onClose: closeModal,
      size: props.size || 'md',
      showCloseButton: props.showCloseButton !== false,
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalProps(null);
  };

  return (
    <ModalContext.Provider value={{ isOpen, modalProps, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};