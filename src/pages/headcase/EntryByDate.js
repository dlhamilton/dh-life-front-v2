import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/api";

const EntryByDate = () => {
  const { date } = useParams();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await api.get(`api/head/diary-entries/date/${date}/`);
        setEntries(res.data);
      } catch (error) {
        console.error("Error fetching diary entries for date", error);
      }
    };
    fetchEntries();
  }, [date]);

  return (
    <div className="container">
      <h2 className="my-4">Diary Entries for {date}</h2>
      {entries.length === 0 ? (
        <p>No entries found for this date.</p>
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

export default EntryByDate;