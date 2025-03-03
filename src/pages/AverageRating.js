import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";

const AverageRating = () => {
  const { id } = useParams();
  const [average, setAverage] = useState(null);
  const [dates, setDates] = useState({ start_date: "", end_date: "" });

  const fetchAverageRating = async () => {
    if (!dates.start_date || !dates.end_date) return;
    try {
      const res = await api.get(`api/focus-areas/${id}/average-rating/`, {
        params: dates,
      });
      setAverage(res.data.average_rating);
    } catch (error) {
      console.error("Error fetching average rating", error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Average Rating for Focus Area</h2>
      <div className="mb-3">
        <label className="form-label">Start Date:</label>
        <input type="date" className="form-control" onChange={(e) => setDates({ ...dates, start_date: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">End Date:</label>
        <input type="date" className="form-control" onChange={(e) => setDates({ ...dates, end_date: e.target.value })} />
      </div>
      <button className="btn btn-primary" onClick={fetchAverageRating}>Get Average Rating</button>

      {average !== null && (
        <p className="mt-4">Average Rating: <strong>{average}</strong></p>
      )}
    </div>
  );
};

export default AverageRating;