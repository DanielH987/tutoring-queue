import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleClick = (path) => {
    setActiveLink(path);
  };

  return (
    <header className="header">
      <h1 className="header-title">POSC Tutoring Queue</h1>
      <nav>
        <ul className="nav-list">
          <li>
            <Link
              to="/"
              className={activeLink === "/" ? "active" : ""}
              onClick={() => handleClick("/")}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/add"
              className={activeLink === "/add" ? "active" : ""}
              onClick={() => handleClick("/add")}
            >
              Add to Queue
            </Link>
          </li>
          <li>
            <Link
              to="/tutor"
              className={activeLink === "/tutor" ? "active" : ""}
              onClick={() => handleClick("/tutor")}
            >
              Tutor Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/student"
              className={activeLink === "/student" ? "active" : ""}
              onClick={() => handleClick("/student")}
            >
              Student View
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
