import React, { useState, useEffect } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "../../assets/WorkoutLogs.css"; // Import CSS for styling

const WorkoutLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; // Prevent fetching if user is not authenticated

    api.get(`/api/train/progress/`)  // Fetch logs for the authenticated user
      .then(res => {
        // Group logs by workout session & date
        const groupedLogs = res.data.reduce((acc, log) => {
          const key = `${log.workout.id}-${log.date_completed}`;
          if (!acc[key]) {
            acc[key] = {
              workout: log.workout,
              date_completed: log.date_completed,
              exercises: []
            };
          }
          acc[key].exercises.push(log);
          return acc;
        }, {});

        // Convert to array and sort by date (most recent first)
        const sortedLogs = Object.values(groupedLogs).sort(
          (a, b) => new Date(b.date_completed) - new Date(a.date_completed)
        );

        setLogs(sortedLogs);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching workout logs:", err);
        setError("Failed to load workout logs. Please try again.");
        setLoading(false);
      });
  }, [user]);

  if (loading) return <p className="loading">Loading workout logs...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="workout-logs-container">
      <h2>Your Workout Logs</h2>
      {logs.length === 0 ? (
        <p>No workout logs found.</p>
      ) : (
        logs.map((log, index) => (
          <div key={index} className="workout-session">
            <h3>{log.workout.name} - <span className="date">{log.date_completed}</span></h3>
            <p><strong>Description:</strong> {log.workout.description}</p>

            <h4>Exercises Performed:</h4>
            <ul className="exercise-list">
              {log.exercises.map((exerciseLog, i) => (
                <li key={i} className="exercise-item">
                  <strong>{exerciseLog.exercise.name}</strong>
                  <p>
                    <span>Weight: {exerciseLog.weight_used_kg ? `${exerciseLog.weight_used_kg} kg` : "N/A"}</span> |
                    <span> Reps: {exerciseLog.reps_completed || "N/A"}</span> |
                    <span> Sets: {exerciseLog.sets_completed || "N/A"}</span>
                  </p>
                </li>
              ))}
            </ul>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default WorkoutLogs;