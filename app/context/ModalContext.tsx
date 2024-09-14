import { createContext, useContext, useState, ReactNode } from 'react';
import Modal from '@/components/Modal'; // Import your Modal component

interface ModalContextType {
  showModal: (message: string) => void;
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

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (message: string) => {
    console.log('showModal', message);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}

      {/* Modal is rendered globally */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Request Picked Up">
        <p>{modalMessage}</p>
      </Modal>
    </ModalContext.Provider>
  );
};
