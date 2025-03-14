import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import FocusAreas from "./pages/headcase/FocusAreas";
import DiaryEntries from "./pages/headcase/DiaryEntries";
import EntryByDate from "./pages/headcase/EntryByDate";
import AverageRating from "./pages/headcase/AverageRating";
import FocusAreaDetail from "./pages/headcase/FocusAreaDetail";
import DiaryEntryDetail from "./pages/headcase/DiaryEntryDetail";
import WorkoutsPage from "./pages/workout/WorkoutsPage";
import WorkoutDetail from "./pages/workout/WorkoutDetail";
import CreateWorkout from "./pages/workout/CreateWorkout";
import ExercisesPage from "./pages/workout/ExercisesPage";
import LogWorkout from "./pages/workout/LogWorkout";
import WorkoutLogs from "./pages/workout/WorkoutLogs";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            {/* Redirect root to Dashboard or Login based on auth */}
            <Route path="/" element={<AuthRedirect />} />
            
            {/* Public Route for Login */}
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/focus-areas" element={<FocusAreas />} />
              <Route path="/diary-entries" element={<DiaryEntries />} />
              <Route path="/entries/:date" element={<EntryByDate />} />
              <Route path="/average-rating/:id" element={<AverageRating />} />
              <Route path="/focus-areas/:id" element={<FocusAreaDetail />} />
              <Route path="/diary-entries/:id" element={<DiaryEntryDetail />} />

              {/* new pages */}
              <Route path="/workouts" element={<WorkoutsPage />} />
              <Route path="/workout-details/:id" element={<WorkoutDetail />} />
              <Route path="/create-workout" element={<CreateWorkout />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/log-workout/:id" element={<LogWorkout />} />
              <Route path="/workout-logs" element={<WorkoutLogs />} />  
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Redirect based on authentication status
const AuthRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default App;