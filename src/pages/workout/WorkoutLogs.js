import React, { useState, useEffect } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "../../assets/WorkoutLogs.css";

const WorkoutLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [editingLog, setEditingLog] = useState(null); // Track which log is being edited
  const [editData, setEditData] = useState({}); // Store edited log data

  useEffect(() => {
    if (!user) return; // Prevent fetching if user is not authenticated

    api.get(`/api/train/progress/`)
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

  // Handle Delete
  const handleDelete = async (logId) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;

    try {
      await api.delete(`/api/train/progress/${logId}/`);
      setLogs((prevLogs) =>
        prevLogs.map(group => ({
          ...group,
          exercises: group.exercises.filter(log => log.id !== logId),
        })).filter(group => group.exercises.length > 0) // Remove empty groups
      );
    } catch (error) {
      console.error("Error deleting log:", error);
      alert("Failed to delete log.");
    }
  };

  // Handle Edit
  const handleEdit = (log) => {
    setEditingLog(log.id);
    setEditData({
      weight_used_kg: log.weight_used_kg || "",
      reps_completed: log.reps_completed || "",
      sets_completed: log.sets_completed || "",
    });
  };

  // Handle Save
  const handleSave = async (logId) => {
    try {
      await api.put(`/api/train/progress/${logId}/`, editData);
      setLogs(logs.map(group => ({
        ...group,
        exercises: group.exercises.map(log =>
          log.id === logId ? { ...log, ...editData } : log
        ),
      })));
      setEditingLog(null);
    } catch (error) {
      console.error("Error updating log:", error);
      alert("Failed to update log.");
    }
  };

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

                  {editingLog === exerciseLog.id ? (
                    <div className="edit-mode">
                      <label>Weight (kg):</label>
                      <input
                        type="number"
                        value={editData.weight_used_kg}
                        onChange={(e) => setEditData({ ...editData, weight_used_kg: e.target.value })}
                      />

                      <label>Reps:</label>
                      <input
                        type="number"
                        value={editData.reps_completed}
                        onChange={(e) => setEditData({ ...editData, reps_completed: e.target.value })}
                      />

                      <label>Sets:</label>
                      <input
                        type="number"
                        value={editData.sets_completed}
                        onChange={(e) => setEditData({ ...editData, sets_completed: e.target.value })}
                      />

                      <button className="save-btn" onClick={() => handleSave(exerciseLog.id)}>Save</button>
                      <button className="cancel-btn" onClick={() => setEditingLog(null)}>Cancel</button>
                    </div>
                  ) : (
                    <p>
                      <span>Weight: {exerciseLog.weight_used_kg ? `${exerciseLog.weight_used_kg} kg` : "N/A"}</span> |
                      <span> Reps: {exerciseLog.reps_completed || "N/A"}</span> |
                      <span> Sets: {exerciseLog.sets_completed || "N/A"}</span>
                    </p>
                  )}

                  <div className="log-actions">
                    {editingLog === exerciseLog.id ? (
                      <button className="cancel-btn" onClick={() => setEditingLog(null)}>Cancel</button>
                    ) : (
                      <button className="edit-btn" onClick={() => handleEdit(exerciseLog)}>Edit</button>
                    )}
                    <button className="delete-btn" onClick={() => handleDelete(exerciseLog.id)}>Delete</button>
                  </div>
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