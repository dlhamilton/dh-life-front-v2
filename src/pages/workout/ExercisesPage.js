import { useEffect, useState } from "react";
import { api } from "../../utils/api";

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    equipment: "",
    exercise_type: "",
  });
  const [sortKey, setSortKey] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const EQUIPMENT_CHOICES = [
    "Dumbbell",
    "Kettlebell",
    "Barbell",
    "Bodyweight",
    "Machine",
    "Resistance Band",
  ];
  
  const EXERCISE_TYPE_CHOICES = [
    "Strength",
    "HIIT",
    "Cardio",
    "Core",
    "Explosive",
  ];

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await api.get("/api/train/exercises/");
      setExercises(res.data);
    } catch (error) {
      console.error("Error fetching exercises", error);
    }
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/train/exercises/", formData);
      await fetchExercises();
      setFormData({ name: "", description: "", equipment: "", exercise_type: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error creating exercise", error);
    }
  };

  const sortedExercises = [...exercises].sort((a, b) => {
    if (!sortKey) return 0;
    return a[sortKey].localeCompare(b[sortKey]);
  });

  const filteredExercises = sortedExercises.filter((exercise) =>
    [exercise.name, exercise.exercise_type, exercise.equipment]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="text-xl font-bold">Exercises</h2>

      <button
        className="mt-4 mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setShowModal(true)}
      >
        Add Exercise
      </button>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="block mb-1">Sort by:</label>
          <select
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
            className="border p-2 rounded"
          >
            <option value="">None</option>
            <option value="name">Name</option>
            <option value="exercise_type">Type</option>
            <option value="equipment">Equipment</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Search:</label>
          <input
            type="text"
            placeholder="Search by name/type/equipment"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-64"
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add New Exercise</h3>
            <form onSubmit={handleCreateExercise} className="space-y-2">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full border p-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full border p-2"
              />
             <select
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                required
                className="w-full border p-2"
              >
                <option value="">-- Select Equipment --</option>
                {EQUIPMENT_CHOICES.map((equipment) => (
                  <option key={equipment} value={equipment}>
                    {equipment}
                  </option>
                ))}
              </select>
              <select
                value={formData.exercise_type}
                onChange={(e) => setFormData({ ...formData, exercise_type: e.target.value })}
                required
                className="w-full border p-2"
              >
                <option value="">-- Select Type --</option>
                {EXERCISE_TYPE_CHOICES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ul className="mt-4">
        {filteredExercises.map((exercise) => (
          <li key={exercise.id}>
            <strong>{exercise.name}</strong> — {exercise.exercise_type} | {exercise.equipment}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExercisesPage;