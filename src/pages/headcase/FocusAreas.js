import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

const FocusAreas = () => {
  const [focusAreas, setFocusAreas] = useState([]);
  const [newFocusArea, setNewFocusArea] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFocusAreas();
  }, []);

  const goToAverageRating = (id) => {
    navigate(`/average-rating/${id}`);
  };

  const goToFocusAreaDetail = (id) => {
    navigate(`/focus-areas/${id}`);
  };

  const fetchFocusAreas = async () => {
    try {
      const res = await api.get("api/head/focus-areas/");
      setFocusAreas(res.data);
    } catch (error) {
      console.error("Error fetching focus areas", error);
    }
  };

  const createFocusArea = async () => {
    try {
      await api.post("api/head/focus-areas/", { name: newFocusArea });
      setNewFocusArea("");
      fetchFocusAreas();
    } catch (error) {
      console.error("Error creating focus area", error);
    }
  };

  return (
    <div className="container">
      <h2>Your Focus Areas</h2>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="New Focus Area"
        value={newFocusArea}
        onChange={(e) => setNewFocusArea(e.target.value)}
      />
      <button className="btn btn-primary mb-3" onClick={createFocusArea}>
        Add Focus Area
      </button>
      <ul className="list-group">
        {focusAreas.map((area) => (
          <li key={area.id} className="list-group-item">
            {area.name}
            <button className="btn btn-sm btn-info ms-2" onClick={() => goToAverageRating(area.id)}>
              View Average Rating
            </button>
            <button className="btn btn-sm btn-info ms-2" onClick={() => goToFocusAreaDetail(area.id)}>
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FocusAreas;