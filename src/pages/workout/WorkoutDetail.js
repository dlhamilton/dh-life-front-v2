import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Required for accessibility

const WorkoutDetail = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]); // Stores all available exercises
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState({
    exercise: "",
    reps: "",
    sets: "",
    duration_seconds: "",
    order_index: "",
  });

  useEffect(() => {
    fetchWorkoutDetails();
    fetchAllExercises(); // Load all available exercises for lookup
  }, []);

  const navigate = useNavigate();

  const fetchWorkoutDetails = async () => {
    try {
      const res = await api.get(`/api/train/workout-exercises/${id}`);
      setWorkout(res.data.workout);
      setExercises(res.data.exercises);
    } catch (error) {
      console.error("Error fetching workout details", error);
    }
  };

  const fetchAllExercises = async () => {
    try {
      const res = await api.get("/api/train/exercises/");
      setAllExercises(res.data);
    } catch (error) {
      console.error("Error fetching exercises", error);
    }
  };

  const openModal = (exercise = null) => {
    if (exercise) {
      setCurrentExercise({
        id: exercise.id,
        exercise: exercise.exercise.id, // Store only the exercise ID
        reps: exercise.reps || "",
        sets: exercise.sets || "",
        duration_seconds: exercise.duration_seconds || "",
        order_index: exercise.order_index || "",
      });
    } else {
      setCurrentExercise({
        exercise: "",
        reps: "",
        sets: "",
        duration_seconds: "",
        order_index: "",
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentExercise({
      exercise: "",
      reps: "",
      sets: "",
      duration_seconds: "",
      order_index: "",
    });
  };

  const handleExerciseChange = (e) => {
    setCurrentExercise({ ...currentExercise, [e.target.name]: e.target.value });
  };

  const saveExercise = async () => {
    try {
      if (currentExercise.id) {
        await api.put(`/api/train/workout-exercises/${currentExercise.id}/`, { ...currentExercise, workout: id });
      } else {
        await api.post("/api/train/workout-exercises/", { ...currentExercise, workout: id });
      }
      fetchWorkoutDetails();
      closeModal();
    } catch (error) {
      console.error("Error saving exercise", error);
    }
  };

  const deleteExercise = async (exerciseId) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;
    try {
      await api.delete(`/api/train/workout-exercises/${exerciseId}/`);
      fetchWorkoutDetails();
    } catch (error) {
      console.error("Error deleting exercise", error);
    }
  };

  const goToWorkoutLog = (id) => {
    navigate(`/log-workout/${id}`);
  };

  if (!workout) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{workout.name}</h1>
      <p className="text-gray-700">{workout.description}</p>
      <p className="text-sm text-gray-500">Week {workout.week}, Day {workout.day}</p>
      <p className="text-sm text-gray-500">Duration: {workout.duration_minutes} minutes</p>

      <button className="btn btn-success my-4" onClick={() => openModal()}>
        + Add Exercise
      </button>
      <button className="btn btn-info my-4" onClick={() => goToWorkoutLog(id)}>
        Log
      </button>

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
              {exercise.duration_seconds && <p className="font-medium">Duration: {exercise.duration_seconds} seconds</p>}
              <p className="text-sm text-gray-500">Order: {exercise.order_index}</p>

              <button className="btn btn-warning me-2" onClick={() => openModal(exercise)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => deleteExercise(exercise.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for Adding/Editing Exercises */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="p-4">
          <h3>{currentExercise.id ? "Edit Exercise" : "Add Exercise"}</h3>

          {/* Dropdown for Selecting Exercise */}
          <select
            name="exercise"
            className="form-control mb-2"
            value={currentExercise.exercise}
            onChange={handleExerciseChange}
          >
            <option value="">--Select Exercise--</option>
            {allExercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="reps"
            placeholder="Reps"
            className="form-control mb-2"
            value={currentExercise.reps}
            onChange={handleExerciseChange}
          />
          <input
            type="number"
            name="sets"
            placeholder="Sets"
            className="form-control mb-2"
            value={currentExercise.sets}
            onChange={handleExerciseChange}
          />
          <input
            type="number"
            name="duration_seconds"
            placeholder="Duration (seconds)"
            className="form-control mb-2"
            value={currentExercise.duration_seconds}
            onChange={handleExerciseChange}
          />
          <input
            type="number"
            name="order_index"
            placeholder="Order Index"
            className="form-control mb-2"
            value={currentExercise.order_index}
            onChange={handleExerciseChange}
          />
          <button className="btn btn-primary me-2" onClick={saveExercise}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default WorkoutDetail;