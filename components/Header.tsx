'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter for programmatic navigation
import { FaUserCircle } from 'react-icons/fa';
import LoginModal from './LoginModal'; // Import the LoginModal component
import { useSession, signOut } from 'next-auth/react'; // Import session hook and signOut

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter(); // Initialize the router for navigation
  const [activeLink, setActiveLink] = useState(pathname);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // State for login modal
  const profileRef = useRef<HTMLDivElement>(null);
  
  const { data: session } = useSession(); // Get session data from NextAuth.js

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const handleClick = (path: string) => {
    setActiveLink(path);
  };

  const toggleProfileMenu = () => {
    setProfileOpen(!profileOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
      setProfileOpen(false);
    }
  };

  useEffect(() => {
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  // Toggle the login modal
  const openLoginModal = () => {
    setShowLoginModal(true);
    setProfileOpen(false); // Close profile dropdown when opening modal
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  // Handle sign-out
  const handleLogout = () => {
    setProfileOpen(false);
    signOut(); // Call signOut from NextAuth.js
  };

  // Navigate to profile page and close the dropdown
  const handleViewProfile = () => {
    setProfileOpen(false); // Close the profile dropdown
    router.push('/profile'); // Navigate to the profile page
  };

  return (
    <>
      <header className="flex justify-between items-center custom-bg-color text-white px-10 h-20">
        <div className="flex items-center">
          <Link href="/" passHref>
            <h1 className="text-2xl font-bold mr-10 cursor-pointer">POSC Tutoring Queue</h1>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className={`hover:text-gray-300 transition-colors duration-300 ${activeLink === '/' ? 'font-bold' : ''}`} onClick={() => handleClick('/')}>
                  Request Help
                </Link>
              </li>
              <li>
                <Link href="/instructions" className={`hover:text-gray-300 transition-colors duration-300 ${activeLink === '/instructions' ? 'font-bold' : ''}`} onClick={() => handleClick('/instructions')}>
                  Instructions
                </Link>
              </li>

              {/* Conditionally render the Queue button if the user is logged in */}
              {session && (
                <li>
                  <Link href="/queue" className={`hover:text-gray-300 transition-colors duration-300 ${activeLink === '/queue' ? 'font-bold' : ''}`} onClick={() => handleClick('/queue')}>
                    Queue
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div
          className="relative cursor-pointer hover:text-gray-300 transition-all duration-300"
          ref={profileRef}
          onClick={toggleProfileMenu}
        >
          <FaUserCircle size={30} />
          {profileOpen && (
            <div className="absolute top-10 right-0 bg-white text-black rounded-lg shadow-lg p-2 z-50">
              <ul className="list-none p-0 m-0">
                {session ? (
                  // When the user is logged in, show View Profile and Logout
                  <>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleViewProfile} // Use handleViewProfile to navigate and close dropdown
                    >
                      View Profile
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </>
                ) : (
                  // When the user is not logged in, show Login
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={openLoginModal}
                  >
                    Login
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Use the LoginModal component */}
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
    </>
  );
};

export default Header;
