import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

const CreateWorkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", description: "", week: 1, day: 1, duration_minutes: 20 });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/train/workouts/", formData);
      navigate("/workouts");
    } catch (error) {
      console.error("Error creating workout", error);
    }
  };

  return (
    <div className="container">
      <h2>Create Workout</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} placeholder="Workout Name" required />
        <textarea name="description" onChange={handleChange} placeholder="Description" required />
        <button type="submit">Create Workout</button>
      </form>
    </div>
  );
};

export default CreateWorkout;