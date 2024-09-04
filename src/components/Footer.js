import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={footerStyle}>
      <p>&copy; 2024 Tutoring Queue App</p>
      <nav>
        <ul style={footerNavListStyle}>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/privacy">Privacy</Link></li>
        </ul>
      </nav>
    </footer>
  );
}

const footerStyle = {
  backgroundColor: '#282c34',
  padding: '10px 20px',
  color: 'white',
  textAlign: 'center',
  position: 'fixed',
  bottom: '0',
  width: '100%',
};

const footerNavListStyle = {
  listStyleType: 'none',
  display: 'inline',
  margin: '0 10px',
};

export default Footer;
