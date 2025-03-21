import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/api";

const getCurrentMonthDates = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const format = (date) => date.toISOString().split("T")[0]; // yyyy-mm-dd

  return {
    start_date: format(start),
    end_date: format(end),
  };
};

const AverageRating = () => {
  const { id } = useParams();
  const [average, setAverage] = useState(null);
  const [focusArea, setFocusArea] = useState(null);
  const [dates, setDates] = useState(getCurrentMonthDates());

  const fetchAverageRating = async () => {
    if (!dates.start_date || !dates.end_date) return;
    try {
      const res = await api.get(`api/head/focus-areas/${id}/average_rating/`, {
        params: dates,
      });
      setAverage(res.data.average_rating);
      setFocusArea(res.data.focus_area);
    } catch (error) {
      console.error("Error fetching average rating", error);
    }
  };

  useEffect(() => {
    fetchAverageRating();
  }, []);

  return (
    <div className="container">
      <h2 className="my-4">Average Rating for {focusArea}</h2>
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