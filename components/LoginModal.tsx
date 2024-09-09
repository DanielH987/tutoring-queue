// components/LoginModal.tsx

'use client';

import { useRef, useEffect, useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and sign-up

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null; // Do not render if the modal is not open
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* X Button to close the modal */}
        <button
            className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black border-none hover:border-2 hover:border-gray-300 hover:rounded-full hover:bg-gray-100 p-2 transition-all duration-300"
            onClick={onClose}
        >
            &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <form>
          {!isLogin && (
            // Only show this field for sign-up
            <div className="mb-4">
              <label htmlFor="name" className="block font-medium mb-1">Name:</label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1">Email:</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-1">Password:</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
