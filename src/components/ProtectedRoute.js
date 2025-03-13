import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Wait for authentication state to load before making a decision
  if (loading) {
    return null; // Or a loading spinner: <div>Loading...</div>
  }

  if (!user) {
    // If not logged in, redirect to login and save intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // If authenticated, render the requested route
};

export default ProtectedRoute;