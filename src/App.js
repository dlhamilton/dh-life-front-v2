import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import FocusAreas from "./pages/FocusAreas";
import DiaryEntries from "./pages/DiaryEntries";
import EntryByDate from "./pages/EntryByDate";
import AverageRating from "./pages/AverageRating";
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
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/focus-areas" element={<FocusAreas />} />
              <Route path="/diary-entries" element={<DiaryEntries />} />
              <Route path="/entries/:date" element={<EntryByDate />} />
              <Route path="/average-rating/:id" element={<AverageRating />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;