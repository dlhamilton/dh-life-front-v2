// import { useEffect, useState } from "react";
// import { api } from "../../utils/api";
// import { useNavigate } from "react-router-dom";

// const WorkoutsPage = () => {
//   const [workouts, setWorkouts] = useState([]);
//   const [exercises, setExercises] = useState([]);
//   const [selectedExercise, setSelectedExercise] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchWorkouts();
//     fetchExercises();
//   }, []);

//   const fetchWorkouts = async () => {
//     try {
//       const res = await api.get("/api/train/workouts/");
//       setWorkouts(res.data);
//     } catch (error) {
//       console.error("Error fetching workouts", error);
//     }
//   };

//   const fetchExercises = async () => {
//     try {
//       const res = await api.get("/api/train/exercises/");
//       setExercises(res.data);
//     } catch (error) {
//       console.error("Error fetching exercises", error);
//     }
//   };

//   const goToWorkoutDetails = (id) => {
//     navigate(`/workout-details/${id}`);
//   };

//   return (
//     <div className="container">
//       <h2>Workouts</h2>
//       <label>Select Exercise:</label>
//       <select onChange={(e) => setSelectedExercise(e.target.value)} className="form-control">
//         <option value="">--Select Exercise--</option>
//         {exercises.map((exercise) => (
//           <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
//         ))}
//       </select>
//       <ul>
//         {workouts.map((workout) => (
//           <li key={workout.id}>
//             {workout.name}
//             <button className="btn btn-info" onClick={() => goToWorkoutDetails(workout.id)}>
//               View Details
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default WorkoutsPage;

import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState({
    name: "",
    description: "",
    week: "",
    day: "",
    duration_minutes: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkouts();
    // fetchExercises();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await api.get("/api/train/workouts/");
      setWorkouts(res.data);
    } catch (error) {
      console.error("Error fetching workouts", error);
    }
  };

  // const fetchExercises = async () => {
  //   try {
  //     const res = await api.get("/api/train/exercises/");
  //     setExercises(res.data);
  //   } catch (error) {
  //     console.error("Error fetching exercises", error);
  //   }
  // };

  const goToWorkoutDetails = (id) => {
    navigate(`/workout-details/${id}`);
  };

  const openModal = (workout = null) => {
    if (workout) {
      setCurrentWorkout(workout);
    } else {
      setCurrentWorkout({
        name: "",
        description: "",
        week: "",
        day: "",
        duration_minutes: "",
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentWorkout({
      name: "",
      description: "",
      week: "",
      day: "",
      duration_minutes: "",
    });
  };

  const handleWorkoutChange = (e) => {
    setCurrentWorkout({ ...currentWorkout, [e.target.name]: e.target.value });
  };

  const handleSaveWorkout = async () => {
    try {
      if (currentWorkout.id) {
        await api.put(`/api/train/workouts/${currentWorkout.id}/`, currentWorkout);
      } else {
        await api.post(`/api/train/workouts/`, currentWorkout);
      }
      fetchWorkouts();
      closeModal();
    } catch (error) {
      console.error("Error saving workout", error);
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await api.delete(`/api/train/workouts/${id}/`);
        fetchWorkouts();
      } catch (error) {
        console.error("Error deleting workout", error);
      }
    }
  };

  // Filter workouts based on selected exercise
  // const filteredWorkouts = selectedExercise
  //   ? workouts.filter((workout) => workout.exercises?.some((ex) => ex.id === Number(selectedExercise)))
  //   : workouts;
  const filteredWorkouts = workouts;

  return (
    <div className="container">
      <h2>Workouts</h2>
      <button className="btn btn-success mb-3" onClick={() => openModal()}>
        + Add Workout
      </button>

      {/* <label>Select Exercise:</label>
      <select onChange={(e) => setSelectedExercise(e.target.value)} className="form-control mb-3">
        <option value="">--Show All Workouts--</option>
        {exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name}
          </option>
        ))}
      </select> */}

      <ul className="list-group">
        {filteredWorkouts.map((workout) => (
          <li key={workout.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{workout.name}</h5>
              <p>{workout.description}</p>
              <small>
                Week {workout.week}, Day {workout.day} | Duration: {workout.duration_minutes} min
              </small>
            </div>
            <div>
              <button className="btn btn-info me-2" onClick={() => goToWorkoutDetails(workout.id)}>
                View
              </button>
              <button className="btn btn-warning me-2" onClick={() => openModal(workout)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteWorkout(workout.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for Adding/Editing Workouts */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="p-4">
          <h3>{currentWorkout.id ? "Edit Workout" : "Add Workout"}</h3>
          <input
            type="text"
            name="name"
            placeholder="Workout Name"
            className="form-control mb-2"
            value={currentWorkout.name}
            onChange={handleWorkoutChange}
          />
          <textarea
            name="description"
            placeholder="Workout Description"
            className="form-control mb-2"
            value={currentWorkout.description}
            onChange={handleWorkoutChange}
          />
          <input
            type="number"
            name="week"
            placeholder="Week"
            className="form-control mb-2"
            value={currentWorkout.week}
            onChange={handleWorkoutChange}
          />
          <input
            type="number"
            name="day"
            placeholder="Day"
            className="form-control mb-2"
            value={currentWorkout.day}
            onChange={handleWorkoutChange}
          />
          <input
            type="number"
            name="duration_minutes"
            placeholder="Duration (minutes)"
            className="form-control mb-2"
            value={currentWorkout.duration_minutes}
            onChange={handleWorkoutChange}
          />
          <button className="btn btn-primary me-2" onClick={handleSaveWorkout}>
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

export default WorkoutsPage;