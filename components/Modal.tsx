import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large'; // Optional size prop for flexibility
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-lg p-6 relative w-full ${sizeClasses[size]} mx-4`}>
        {/* Modal Header */}
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              className="text-gray-500 hover:text-black focus:outline-none"
              onClick={onClose}
            >
              <FaTimes size={18} />
            </button>
          </div>
        )}

        {/* Modal Content */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
