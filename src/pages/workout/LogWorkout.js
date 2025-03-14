import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "../../assets/LogWorkout.css"

const LogWorkout = () => {
    const { id: workoutId } = useParams(); 
    const [workout, setWorkout] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [logData, setLogData] = useState({});
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!workoutId) {
        navigate("/workouts"); 
        return;
      }

      api.get(`/api/train/workout-exercises/${workoutId}`)
        .then(res => {
          setWorkout(res.data.workout);
          setExercises(res.data.exercises);
          
          const initialLogData = {};
          res.data.exercises.forEach(exercise => {
            initialLogData[exercise.exercise.id] = {
              weight_used_kg: "",
              reps_completed: "",
              sets_completed: ""
            };
          });
          setLogData(initialLogData);
        })
        .catch(err => console.error("Error fetching exercises:", err));
    }, [workoutId, navigate]);

    const handleChange = (exerciseId, field, value) => {
      setLogData(prev => ({
        ...prev,
        [exerciseId]: { ...prev[exerciseId], [field]: value }
      }));
    };

    const handleSubmit = async () => {
        try {
          const workoutLogs = exercises.map((exercise) => ({
            workout: workoutId,
            exercise: exercise.exercise.id,
            weight_used_kg: logData[exercise.exercise.id]?.weight_used_kg || null,
            reps_completed: logData[exercise.exercise.id]?.reps_completed || null,
            sets_completed: logData[exercise.exercise.id]?.sets_completed || null,
          }));
      
          // Send all exercises in one request
          await api.post("/api/train/log-workout/", { logs: workoutLogs });
      
          alert("Workout logged successfully!");
          navigate("/workout-logs");
        } catch (error) {
          console.error("Error logging workout:", error.response ? error.response.data : error.message);
        }
      };

    if (!workout) return <p className="loading">Loading workout details...</p>;

    return (
      <div className="log-workout-container">
        <h2 className="title">{workout.name}</h2>
        <p className="description"><strong>Description:</strong> {workout.description}</p>
        <p className="info"><strong>Week:</strong> {workout.week} | <strong>Day:</strong> {workout.day}</p>
        <p className="info"><strong>Duration:</strong> {workout.duration_minutes} minutes</p>

        <h3 className="exercise-title">Exercises</h3>
        {exercises.map(exercise => (
          <div key={exercise.exercise.id} className="exercise-card">
            <div className="exercise-header">
              <h4>{exercise.exercise.name}</h4>
              <p className="exercise-meta">
                {exercise.exercise.equipment} | {exercise.exercise.exercise_type}
              </p>
            </div>
            <p><strong>Description:</strong> {exercise.exercise.description}</p>
            <p><strong>Reps:</strong> {exercise.reps || "N/A"} | <strong>Sets:</strong> {exercise.sets || "N/A"} | <strong>Duration:</strong> {exercise.duration_seconds ? `${exercise.duration_seconds}s` : "N/A"}</p>

            <div className="input-group">
              <label>Weight Used (kg):</label>
              <input
                type="number"
                value={logData[exercise.exercise.id]?.weight_used_kg || ""}
                onChange={(e) => handleChange(exercise.exercise.id, "weight_used_kg", e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Reps Completed:</label>
              <input
                type="number"
                value={logData[exercise.exercise.id]?.reps_completed || ""}
                onChange={(e) => handleChange(exercise.exercise.id, "reps_completed", e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Sets Completed:</label>
              <input
                type="number"
                value={logData[exercise.exercise.id]?.sets_completed || ""}
                onChange={(e) => handleChange(exercise.exercise.id, "sets_completed", e.target.value)}
              />
            </div>
          </div>
        ))}
        <button className="submit-btn" onClick={handleSubmit}>Submit Log</button>
      </div>
    );
};

export default LogWorkout;