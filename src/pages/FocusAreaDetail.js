import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const FocusAreaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [focusArea, setFocusArea] = useState({ name: "" });

  useEffect(() => {
    fetchFocusArea();
  }, []);

  const fetchFocusArea = async () => {
    try {
      const res = await api.get(`api/focus-areas/${id}/`);
      setFocusArea(res.data);
    } catch (error) {
      console.error("Error fetching focus area", error);
    }
  };

  const updateFocusArea = async () => {
    try {
      await api.put(`api/focus-areas/${id}/`, focusArea);
      navigate("/focus-areas");
    } catch (error) {
      console.error("Error updating focus area", error);
    }
  };

  const deleteFocusArea = async () => {
    try {
      await api.delete(`api/focus-areas/${id}/`);
      navigate("/focus-areas");
    } catch (error) {
      console.error("Error deleting focus area", error);
    }
  };

  return (
    <div className="container">
      <h2>Focus Area Details</h2>
      <input
        type="text"
        className="form-control mb-2"
        value={focusArea.name}
        onChange={(e) => setFocusArea({ ...focusArea, name: e.target.value })}
      />
      <button className="btn btn-success me-2" onClick={updateFocusArea}>Update</button>
      <button className="btn btn-danger" onClick={deleteFocusArea}>Delete</button>
    </div>
  );
};

export default FocusAreaDetail;