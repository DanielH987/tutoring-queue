'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter for programmatic navigation
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa'; // Import icons
import LoginModal from './LoginModal'; // Import the LoginModal component
import { useSession, signOut } from 'next-auth/react'; // Import session hook and signOut

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter(); // Initialize the router for navigation
  const [activeLink, setActiveLink] = useState(pathname);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // State for login modal
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const profileRef = useRef<HTMLDivElement>(null);
  
  const { data: session, status } = useSession(); // Get session data and status from NextAuth.js

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const handleClick = (path: string) => {
    setActiveLink(path);
  };

  const toggleProfileMenu = () => {
    setProfileOpen(!profileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
      <header className="flex justify-between items-center custom-bg-color text-white px-4 h-20 relative">
        {/* Left Section: Logo and Navigation */}
        <div className="flex items-center">
          <Link href="/" passHref>
            <h1 className="text-2xl font-bold cursor-pointer">POSC Tutoring Queue</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 ml-10">
            <Link href="/" className={`hover:text-gray-300 transition-colors duration-300 ${activeLink === '/' ? 'font-bold' : ''}`} onClick={() => handleClick('/')}>
              Request Help
            </Link>
            <Link href="/instructions" className={`hover:text-gray-300 transition-colors duration-300 ${activeLink === '/instructions' ? 'font-bold' : ''}`} onClick={() => handleClick('/instructions')}>
              Instructions
            </Link>
            {status === 'authenticated' && (
              <Link href="/queue" className={`hover:text-gray-300 transition-colors duration-300 ${activeLink === '/queue' ? 'font-bold' : ''}`} onClick={() => handleClick('/queue')}>
                Queue
              </Link>
            )}
            {status === 'authenticated' && session?.user?.role === 'admin' && (
              <Link href="/admin" className={`hover:text-gray-300 transition-colors duration-300 ${activeLink === '/admin' ? 'font-bold' : ''}`} onClick={() => handleClick('/admin')}>
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Hamburger Menu (Centered between left and right) */}
        <div className="md:hidden ml-auto relative">
          <button
            onClick={toggleMobileMenu}
            className="custom-bg-color text-white focus:outline-none transition-transform duration-300 transform"
          >
            {isMobileMenuOpen ? (
              <FaTimes size={24} className="transition-transform duration-300 transform rotate-90" />
            ) : (
              <FaBars size={24} className="transition-transform duration-300 transform rotate-0" />
            )}
          </button>
        </div>

        {/* Profile Icon */}
        <div className="ml-auto relative cursor-pointer hover:text-gray-300 transition-all duration-300" ref={profileRef} onClick={toggleProfileMenu}>
          <FaUserCircle size={30} />
          {profileOpen && (
            <div className="absolute top-10 right-0 bg-white text-black rounded-lg shadow-lg p-2 z-50 dark:bg-gray-800 dark:text-white">
              <ul className="list-none p-0 m-0">
                {session ? (
                  <>
                    <li className="px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-900 cursor-pointer" onClick={handleViewProfile}>
                      View Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-900 cursor-pointer" onClick={handleLogout}>
                      Logout
                    </li>
                  </>
                ) : (
                  <li className="px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-900 cursor-pointer" onClick={openLoginModal}>
                    Login
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className={`md:hidden custom-bg-color text-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
          <ul className="flex flex-col items-center space-y-4 p-4">
            <li>
              <Link href="/" className={`hover:text-gray-300 transition-colors duration-300 ${activeLink === '/' ? 'font-bold' : ''}`} onClick={() => { handleClick('/'); toggleMobileMenu(); }}>
                Request Help
              </Link>
            </li>
            <li>
              <Link href="/instructions" className={`hover:text-gray-300 transition-colors duration-300 ${activeLink === '/instructions' ? 'font-bold' : ''}`} onClick={() => { handleClick('/instructions'); toggleMobileMenu(); }}>
                Instructions
              </Link>
            </li>
            {status === 'authenticated' && (
              <li>
                <Link href="/queue" className={`hover:text-gray-300 transition-colors duration-300 ${activeLink === '/queue' ? 'font-bold' : ''}`} onClick={() => { handleClick('/queue'); toggleMobileMenu(); }}>
                  Queue
                </Link>
              </li>
            )}
            {status === 'authenticated' && session?.user?.role === 'admin' && (
              <li>
                <Link href="/admin" className={`hover:text-gray-300 transition-colors duration-300 ${activeLink === '/admin' ? 'font-bold' : ''}`} onClick={() => { handleClick('/admin'); toggleMobileMenu(); }}>
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}

      {/* Use the LoginModal component */}
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
    </>
  );
};

export default Header;
