import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const DiaryEntries = () => {
  const [entries, setEntries] = useState([]);
  const [focusAreas, setFocusAreas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchFocusAreas();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchEntries(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate]);

  const fetchFocusAreas = async () => {
    try {
      const res = await api.get("api/head/focus-areas/");
      setFocusAreas(res.data);
    } catch (error) {
      console.error("Error fetching focus areas", error);
    }
  };

  const fetchEntries = async (date) => {
    try {
      const res = await api.get(`api/head/diary-entries/date/${date}/`);
      setEntries(res.data);
    } catch (error) {
      console.error("Error fetching diary entries", error);
    }
  };

  const goToEntryDetails = (id) => {
    navigate(`/diary-entries/${id}`);
  };

  const addNewEntry = (focusAreaId) => {
    navigate(`/diary-entries/new?focus_area=${focusAreaId}&date=${format(selectedDate, "yyyy-MM-dd")}`);
  };

  return (
    <div className="container">
      <h2>Your Diary Entries</h2>

      {/* Date Picker */}
      <div className="mb-3">
        <label className="form-label">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="form-control"
        />
      </div>

      {/* Display Focus Areas and Entries */}
      {focusAreas.length > 0 ? (
        focusAreas.map((focusArea) => {
          const entry = entries.find((e) => e.focus_area === focusArea.id);

          return (
            <div key={focusArea.id} className="mb-4">
              <h4>{focusArea.name}</h4>
              {entry ? (
                <div className="card p-3">
                  <p><strong>Note:</strong> {entry.note}</p>
                  <p><strong>Rating:</strong> {entry.rating}/10</p>
                  <button className="btn btn-info" onClick={() => goToEntryDetails(entry.id)}>
                    View Entry
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-muted">No entry for this focus area on {format(selectedDate, "yyyy-MM-dd")}.</p>
                  <button className="btn btn-success" onClick={() => addNewEntry(focusArea.id)}>
                    Add Entry
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-danger">No focus areas found.</p>
      )}
    </div>
  );
};

export default DiaryEntries;