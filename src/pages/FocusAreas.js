import { useEffect, useState } from "react";
import { api } from "../utils/api";

const FocusAreas = () => {
  const [focusAreas, setFocusAreas] = useState([]);

  useEffect(() => {
    const fetchFocusAreas = async () => {
      const res = await api.get("api/focus-areas/");
      setFocusAreas(res.data);
    };
    fetchFocusAreas();
  }, []);

  return (
    <div className="container">
      <h2 className="my-4">Your Focus Areas</h2>
      <ul className="list-group">
        {focusAreas.map((area) => (
          <li key={area.id} className="list-group-item">{area.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FocusAreas;