'use client';

import { signIn } from 'next-auth/react';
import { useRef, useEffect, useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and sign-up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [error, setError] = useState('');

  // Reset errors and form fields when closing the modal or switching modes
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setEmailError(false);
    setPasswordError(false);
    setNameError(false);
  };

  // Ensure the login form is always shown when the modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLogin(true); // Always reset to login mode when modal is opened
      resetForm(); // Reset form fields and errors
    }
  }, [isOpen]);

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        resetForm(); // Reset form when closing
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Handle login
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        onClose(); // Close modal on successful login
      }
    } else {
      // Handle sign-up
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        onClose(); // Close modal on successful sign-up
        setIsLogin(true); // Switch to login mode
      }
    }

    // Reset errors
    setEmailError(false);
    setPasswordError(false);
    setNameError(false);

    // Validate fields
    let valid = true;
    if (!email) {
      setEmailError(true);
      valid = false;
    }
    if (!password) {
      setPasswordError(true);
      valid = false;
    }
    if (!isLogin && !name) {
      setNameError(true);
      valid = false;
    }

    // If all fields are valid, proceed with the submission logic
    if (valid) {
      // Implement login or sign-up logic here
      console.log("Form submitted");
    }
  };

  // Handle mode toggle and reset errors
  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    resetForm(); // Reset form when switching modes
  };

  if (!isOpen) {
    return null; // Do not render if the modal is not open
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div>{error && <p>{error}</p>}</div>
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* X Button to close the modal */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black border-none hover:border-2 hover:border-gray-300 hover:rounded-full hover:bg-gray-100 p-2 transition-all duration-300"
          onClick={() => {
            resetForm(); // Reset form when closing via the "X" button
            onClose();
          }}
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block font-medium mb-1">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2 border rounded-lg ${nameError ? 'border-red-600 bg-red-100' : 'border-gray-300 bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-black`}
              />
              {nameError && <p className="text-red-600 text-sm mt-1">This field is required</p>}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border rounded-lg ${emailError ? 'border-red-600 bg-red-100' : 'border-gray-300 bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-black`}
              />
            {emailError && <p className="text-red-600 text-sm mt-1">This field is required</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-1">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border rounded-lg ${passwordError ? 'border-red-600 bg-red-100' : 'border-gray-300 bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-black`}
              />
            {passwordError && <p className="text-red-600 text-sm mt-1">This field is required</p>}
          </div>
          <div className="flex justify-between items-center">
            <button type="submit" className="custom-bg-color text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-colors duration-300">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="text-gray-500 mt-4 text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            className="cursor-pointer underline"
            onClick={handleModeSwitch} // Switch between login and sign-up
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
