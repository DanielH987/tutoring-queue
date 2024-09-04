import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={headerStyle}>
      <nav>
        <ul style={navListStyle}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add">Add to Queue</Link></li>
          <li><Link to="/tutor">Tutor Dashboard</Link></li>
          <li><Link to="/student">Student View</Link></li>
        </ul>
      </nav>
    </header>
  );
}

const headerStyle = {
  backgroundColor: '#282c34',
  padding: '10px 20px',
  color: 'white',
};

const navListStyle = {
  listStyleType: 'none',
  display: 'flex',
  justifyContent: 'space-around',
  margin: '0',
  padding: '0',
};

export default Header;
