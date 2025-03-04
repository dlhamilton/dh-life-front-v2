import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const DiaryEntryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState({ focus_area: "", note: "", rating: "" });

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const res = await api.get(`api/head/diary-entries/${id}/`);
      setEntry(res.data);
    } catch (error) {
      console.error("Error fetching diary entry", error);
    }
  };

  const updateEntry = async () => {
    try {
      await api.put(`api/head/diary-entries/${id}/`, entry);
      navigate("/diary-entries");
    } catch (error) {
      console.error("Error updating entry", error);
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
      <h2>Edit Diary Entry</h2>
      <p>({entry.date})</p>
      <label for="focusArea">Focus Area</label>
      <input
        name="focusArea"
        type="text"
        className="form-control mb-2"
        placeholder="Focus Area"
        value={entry.focus_area_name}
        onChange={(e) => setEntry({ ...entry, focus_area_name: e.target.value })}
      />
      <label for="note">Note</label>
      <textarea
        name="note"
        className="form-control mb-2"
        placeholder="Note"
        value={entry.note}
        onChange={(e) => setEntry({ ...entry, note: e.target.value })}
      />
      <label for="rating">Rating</label>
      <input
        name="rating"
        type="number"
        className="form-control mb-2"
        placeholder="Rating"
        value={entry.rating}
        onChange={(e) => setEntry({ ...entry, rating: e.target.value })}
      />
      <button className="btn btn-success me-2" onClick={updateEntry}>Update</button>
      <button className="btn btn-danger" onClick={deleteEntry}>Delete</button>
    </div>
  );
};

export default DiaryEntryDetail;