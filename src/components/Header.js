import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleClick = (path) => {
    setActiveLink(path);
  };

  return (
    <header className="header">
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
        </ul>
      </nav>
    </header>
  );
}

export default Header;
