import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/Header.css';

function Header() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleClick = (path) => {
    setActiveLink(path);
  };

  const toggleProfileMenu = () => {
    setProfileOpen(!profileOpen);
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
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
    <header className="header">
      <div className="nav-and-title">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className="header-title">POSC Tutoring Queue</h1>
        </Link>
        <nav>
          <ul className="nav-list">
            <li>
              <Link
                to="/"
                className={activeLink === "/" ? "active" : ""}
                onClick={() => handleClick("/")}
              >
                Request Help
              </Link>
            </li>
            <li>
              <Link
                to="/instructions"
                className={activeLink === "/instructions" ? "active" : ""}
                onClick={() => handleClick("/instructions")}
              >
                Instructions
              </Link>
            </li>
            <li>
              <Link
                to="/queue"
                className={activeLink === "/queue" ? "active" : ""}
                onClick={() => handleClick("/queue")}
              >
                Queue
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="profile-icon" ref={profileRef} onClick={toggleProfileMenu}>
        <FaUserCircle size={30} />
        {profileOpen && (
          <div className="profile-dropdown">
            <ul>
              <li>View Profile</li>
              <li>Settings</li>
              <li>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
