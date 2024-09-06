'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';

const Header: React.FC = () => {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(pathname);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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

  return (
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
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View Profile</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
