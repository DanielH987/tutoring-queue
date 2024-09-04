import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2024 Daniel Hootini</p>
      <nav>
        <ul className="footer-nav-list">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/privacy">Privacy</Link></li>
        </ul>
      </nav>
    </footer>
  );
}

export default Footer;
