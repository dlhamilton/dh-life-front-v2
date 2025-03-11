import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../utils/api";

const DiaryEntryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = id === "new"; // Check if we are creating a new entry
  const focusAreaId = searchParams.get("focus_area");
  const entryDate = searchParams.get("date");

  const [entry, setEntry] = useState({
    focus_area: focusAreaId || "",
    date: entryDate || "",
    note: "",
    rating: "",
  });

  useEffect(() => {
    if (!isNew) {
      fetchEntry();
    }
  }, [id]);

  const fetchEntry = async () => {
    try {
      const res = await api.get(`api/head/diary-entries/${id}/`);
      setEntry(res.data);
    } catch (error) {
      console.error("Error fetching diary entry", error);
    }
  };

  const saveEntry = async () => {
    try {
      if (isNew) {
        // Create new entry
        await api.post(`api/head/diary-entries/`, entry);
      } else {
        // Update existing entry
        await api.put(`api/head/diary-entries/${id}/`, entry);
      }
      navigate("/diary-entries");
    } catch (error) {
      console.error("Error saving entry", error);
    }
  };

  const deleteEntry = async () => {
    try {
      await api.delete(`api/head/diary-entries/${id}/`);
      navigate("/diary-entries");
    } catch (error) {
      console.error("Error deleting entry", error);
    }
  };

  return (
    <div className="container">
      <h2>{isNew ? "Create New Diary Entry" : "Edit Diary Entry"}</h2>
      <p>({entry.date})</p>

      <label htmlFor="focusArea">Focus Area</label>
      <input
        name="focusArea"
        type="text"
        className="form-control mb-2"
        placeholder="Focus Area"
        value={entry.focus_area}
        readOnly={isNew ? false : true} // Prevent changing on edit
        onChange={(e) => setEntry({ ...entry, focus_area: e.target.value })}
      />

      <label htmlFor="note">Note</label>
      <textarea
        name="note"
        className="form-control mb-2"
        placeholder="Note"
        value={entry.note}
        onChange={(e) => setEntry({ ...entry, note: e.target.value })}
      />

      <label htmlFor="rating">Rating</label>
      <input
        name="rating"
        type="number"
        className="form-control mb-2"
        placeholder="Rating"
        value={entry.rating}
        onChange={(e) => setEntry({ ...entry, rating: e.target.value })}
      />

      <button className="btn btn-success me-2" onClick={saveEntry}>
        {isNew ? "Create" : "Update"}
      </button>

      {!isNew && (
        <button className="btn btn-danger" onClick={deleteEntry}>
          Delete
        </button>
      )}
    </div>
  );
};

export default DiaryEntryDetail;