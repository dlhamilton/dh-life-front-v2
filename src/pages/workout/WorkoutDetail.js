import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/api";

const WorkoutDetail = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetchWorkoutDetails();
  }, []);

  const fetchWorkoutDetails = async () => {
    try {
      const res = await api.get(`/api/train/workout-exercises/${id}`);
      setWorkout(res.data.workout);
      setExercises(res.data.exercises);
    } catch (error) {
      console.error("Error fetching workout details", error);
    }
  };

  if (!workout) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{workout.name}</h1>
      <p className="text-gray-700">{workout.description}</p>
      <p className="text-sm text-gray-500">Week {workout.week}, Day {workout.day}</p>
      <p className="text-sm text-gray-500">Duration: {workout.duration_minutes} minutes</p>

      <h3 className="text-xl font-semibold mt-4 mb-2">Workout Routine</h3>
      <ul className="list-none space-y-4">
        {exercises.map((exercise, index) => (
          <li key={index} className="p-4 border rounded-lg shadow-md bg-white">
            <h4 className="text-lg font-bold">{exercise.exercise.name}</h4>
            <p className="text-gray-600">{exercise.exercise.description}</p>
            <p className="text-sm text-gray-500">Equipment: {exercise.exercise.equipment}</p>
            
            <div className="mt-2">
              {exercise.sets !== null && <p className="font-medium">Sets: {exercise.sets}</p>}
              {exercise.reps !== null && <p className="font-medium">Reps: {exercise.reps}</p>}  
              {exercise.duration_seconds && (
                <p className="font-medium">Duration: {exercise.duration_seconds} seconds</p>
              )}
              <p className="text-sm text-gray-500">Order: {exercise.order_index}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutDetail;