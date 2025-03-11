import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">Mental Health Diary</Link>
        <div className="navbar-nav ms-auto">
          {user ? (
            <>
              <Link className="nav-link" to="/focus-areas">Focus Areas</Link>
              <Link className="nav-link" to="/diary-entries">Diary Entries</Link>
              <Link className="nav-link" to="/workouts">Workouts</Link>
              <button className="btn btn-danger ms-2" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link className="btn btn-light" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;