import { useEffect, useState } from "react";
import { api } from "../utils/api";

const DiaryEntries = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await api.get("api/diary-entries/");
        setEntries(res.data);
      } catch (error) {
        console.error("Error fetching diary entries", error);
      }
    };
    fetchEntries();
  }, []);

  return (
    <div className="container">
      <h2 className="my-4">Your Diary Entries</h2>
      {entries.length === 0 ? (
        <p>No diary entries found.</p>
      ) : (
        <ul className="list-group">
          {entries.map((entry) => (
            <li key={entry.id} className="list-group-item">
              <strong>{entry.focus_area}</strong>: {entry.note} (Rating: {entry.rating}/10)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DiaryEntries;