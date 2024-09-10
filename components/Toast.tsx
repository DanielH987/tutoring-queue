import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import classNames from 'classnames';

interface ToastProps {
  message: string;
  type: 'destructive' | 'success' | 'info';
  duration?: number; // Optional duration for auto-hide (in ms)
  onClose: () => void; // Callback when the toast is closed
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);

  // Automatically hide the toast after the duration
  useEffect(() => {
    setIsMounted(true); // Trigger entry animation
    const timer = setTimeout(() => {
      setIsMounted(false); // Trigger exit animation
      setTimeout(() => onClose(), 300); // Delay close callback until exit animation completes
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Conditional class names for different toast types
  const toastClass = classNames(
    'fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg flex items-center space-x-3 text-white transition-transform transition-opacity duration-300 ease-in-out',
    {
      'bg-red-600': type === 'destructive',
      'bg-green-600': type === 'success',
      'bg-blue-600': type === 'info',
      'opacity-100 translate-y-0': isMounted,
      'opacity-0 -translate-y-5': !isMounted, // Smoothly translate and fade on exit
    }
  );

  return (
    <div className={toastClass}>
      <span>{message}</span>
      <FaTimes
        className="cursor-pointer ml-4"
        onClick={() => {
          setIsMounted(false); // Trigger exit animation on manual close
          setTimeout(onClose, 300); // Delay close until exit animation completes
        }}
      />
    </div>
  );
};

export default Toast;
