import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../assets/Navbar.css";  // ✅ Import CSS

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Name */}
        <Link className="brand" to="/dashboard">Mental Health Diary</Link>

        {/* Burger Menu Icon */}
        <div className={`burger-menu ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link className="nav-item" to="/workout-timer" onClick={() => setMenuOpen(false)}>Workout Timer</Link>
          {user ? (
            <>
              <Link className="nav-item" to="/focus-areas" onClick={() => setMenuOpen(false)}>Focus Areas</Link>
              <Link className="nav-item" to="/diary-entries" onClick={() => setMenuOpen(false)}>Diary Entries</Link>
              <Link className="nav-item" to="/workouts" onClick={() => setMenuOpen(false)}>Workouts</Link>
              <Link className="nav-item" to="/workout-logs" onClick={() => setMenuOpen(false)}>Workout Logs</Link>
              <button className="logout-btn" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <Link className="login-btn" to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;