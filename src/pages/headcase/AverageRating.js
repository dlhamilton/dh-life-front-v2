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
  const [ratings, setRatings] = useState([]);
  const [entries, setEntries] = useState([]);

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

  const fetchRatings = async () => {
    try {
      const res = await api.get(`api/head/focus-areas/${id}/ratings/`, {
        params: dates,
      });
      setRatings(res.data.ratings);
      setFocusArea(res.data.focus_area);
    } catch (error) {
      console.error("Error fetching ratings", error);
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await api.get(`api/head/focus-areas/${id}/entries/`, {
        params: dates,
      });
      setEntries(res.data.entries);
      setFocusArea(res.data.focus_area);
    } catch (error) {
      console.error("Error fetching entries", error);
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
        <input
          type="date"
          className="form-control"
          value={dates.start_date}
          onChange={(e) =>
            setDates({ ...dates, start_date: e.target.value })
          }
        />
      </div>
      <div className="mb-3">
        <label className="form-label">End Date:</label>
        <input
          type="date"
          className="form-control"
          value={dates.end_date}
          onChange={(e) =>
            setDates({ ...dates, end_date: e.target.value })
          }
        />
      </div>

      <div className="d-flex gap-2 flex-wrap mb-4">
        <button className="btn btn-primary" onClick={fetchAverageRating}>
          Get Average Rating
        </button>
        <button className="btn btn-secondary" onClick={fetchRatings}>
          Get All Ratings
        </button>
        <button className="btn btn-info" onClick={fetchEntries}>
          Get All Entries
        </button>
      </div>

      {average !== null && (
        <p className="mt-2">
          <strong>Average Rating:</strong> {average}
        </p>
      )}

      {ratings.length > 0 && (
        <div className="mt-4">
          <h4>Ratings Between Dates</h4>
          <ul className="list-group">
            {ratings.map((r) => (
              <li key={r.id} className="list-group-item">
                {r.date} – Rating: {r.rating}
              </li>
            ))}
          </ul>
        </div>
      )}

      {entries.length > 0 && (
        <div className="mt-4">
          <h4>Entries Between Dates</h4>
          <ul className="list-group">
            {entries.map((entry) => (
              <li key={entry.id} className="list-group-item">
                <div><strong>{entry.date}</strong></div>
                <div>Rating: {entry.rating}</div>
                <div>{entry.note || <em>No note</em>}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AverageRating;