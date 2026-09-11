import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'  

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-icon">🚗</span>
            <span className="logo-text">
              Kelly <span className="logo-highlight">Motors</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              <span className="nav-icon">🏠</span>
              Home
            </Link>
            <Link to="/cars" className={`nav-link ${isActive('/cars')}`}>
              <span className="nav-icon">🚙</span>
              Cars
            </Link>
            <Link to="/about" className={`nav-link ${isActive('/about')}`}>
              <span className="nav-icon">ℹ️</span>
              About
            </Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>
              <span className="nav-icon">📧</span>
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="menu-toggle" 
            onClick={toggleMenu} 
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="mobile-nav-link" onClick={toggleMenu}>
            <span className="nav-icon">🏠</span>
            Home
          </Link>
          <Link to="/cars" className="mobile-nav-link" onClick={toggleMenu}>
            <span className="nav-icon">🚙</span>
            Cars
          </Link>
          <Link to="/about" className="mobile-nav-link" onClick={toggleMenu}>
            <span className="nav-icon">ℹ️</span>
            About
          </Link>
          <Link to="/contact" className="mobile-nav-link" onClick={toggleMenu}>
            <span className="nav-icon">📧</span>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar