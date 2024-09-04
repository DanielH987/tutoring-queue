import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';  // Import the styles for Header component

function Header() {
  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add">Add to Queue</Link></li>
          <li><Link to="/tutor">Tutor Dashboard</Link></li>
          <li><Link to="/student">Student View</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
