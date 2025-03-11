import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkouts();
    fetchExercises();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await api.get("/api/train/workouts/");
      setWorkouts(res.data);
    } catch (error) {
      console.error("Error fetching workouts", error);
    }
  };

  const fetchExercises = async () => {
    try {
      const res = await api.get("/api/train/exercises/");
      setExercises(res.data);
    } catch (error) {
      console.error("Error fetching exercises", error);
    }
  };

  const goToWorkoutDetails = (id) => {
    navigate(`/workout-details/${id}`);
  };

  return (
    <div className="container">
      <h2>Workouts</h2>
      <label>Select Exercise:</label>
      <select onChange={(e) => setSelectedExercise(e.target.value)} className="form-control">
        <option value="">--Select Exercise--</option>
        {exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
        ))}
      </select>
      <ul>
        {workouts.map((workout) => (
          <li key={workout.id}>
            {workout.name}
            <button className="btn btn-info" onClick={() => goToWorkoutDetails(workout.id)}>
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutsPage;