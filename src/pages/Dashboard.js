import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Welcome to Your Mental Health Diary</h1>
      <p className="lead">Track your focus areas and mental well-being over time.</p>
      <ul>
        <li><Link to="/focus-areas">View Focus Areas</Link></li>
        <li><Link to="/diary-entries">View Diary Entries</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;