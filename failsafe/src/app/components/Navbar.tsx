'use client'; // ← ADD THIS LINE at the very top

import React, { useState } from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          <div className="logo-icon">L</div>
          <span>MyApp</span>
        </a>

        {/* Navigation Links */}
        <div className="nav-menu">
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          <button className="auth-btn login-btn">Login</button>
          <button className="auth-btn signup-btn">Sign Up</button>
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;