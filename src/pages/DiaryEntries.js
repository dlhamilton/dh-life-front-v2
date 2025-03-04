import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const DiaryEntries = () => {
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const goToEntryDetails = (id) => {
    navigate(`/diary-entries/${id}`);
  };

  const fetchEntries = async () => {
    try {
      const res = await api.get("api/diary-entries/");
      setEntries(res.data);
    } catch (error) {
      console.error("Error fetching diary entries", error);
    }
  };

  // Format date to YYYY-MM-DD for the API
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  return (
    <div className="container">
      <h2>Your Diary Entries</h2>

      {/* Date Picker to Select Date */}
      <div className="mb-3">
        <label className="form-label">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="form-control"
          placeholderText="Pick a date"
        />
      </div>

      {/* Link to View Entries by Selected Date */}
      {formattedDate && (
        <Link to={`/entries/${formattedDate}`} className="btn btn-primary mb-3">
          View Entries for {formattedDate}
        </Link>
      )}

      <ul className="list-group">
        {entries.map((entry) => (
          <li key={entry.id} className="list-group-item">
            <strong>{entry.focus_area}</strong>: {entry.note} (Rating: {entry.rating}/10)
            <button className="btn btn-sm btn-info ms-2" onClick={() => goToEntryDetails(entry.id)}>
              View Entry
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiaryEntries;