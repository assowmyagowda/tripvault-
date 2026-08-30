import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo" onClick={closeMenu}>
        ✈️ TripVault
      </Link>

      {/* Hamburger */}
      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Open navigation menu"
      >
        ☰
      </button>

      {/* Links */}
      <div className={`nav-links ${menuOpen ? "show" : ""}`}>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/login" onClick={closeMenu}>
          Login
        </Link>

        <Link to="/register" onClick={closeMenu}>
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;