import { useEffect, useState } from "react";
import { api } from "../../utils/api";

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await api.get("/api/train/exercises");
      setExercises(res.data);
    } catch (error) {
      console.error("Error fetching exercises", error);
    }
  };

  return (
    <div className="container">
      <h2>Exercises</h2>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>{exercise.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExercisesPage;
