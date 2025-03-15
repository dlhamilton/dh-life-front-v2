import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/api";
import "../../assets/WorkoutTimer.css";
import beepSound from "../../assets/beep.mp3";

const WorkoutTimer = () => {
  const { id: workoutId } = useParams();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("AMRAP");
  const [amrapDuration, setAmrapDuration] = useState(10);
  const [emomInterval, setEmomInterval] = useState(60);
  const [emomTotalDuration, setEmomTotalDuration] = useState(10);
  const [tally, setTally] = useState(0);
  const [flash, setFlash] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [sideBySide, setSideBySide] = useState(false);
  const audioRef = useRef(new Audio(beepSound));

  // Fetch workout details if an ID is provided in the URL
  useEffect(() => {
    if (!workoutId) return;

    api.get(`/api/train/workout-exercises/${workoutId}`)
      .then((res) => {
        console.log("Workout API Response:", res.data);
        setWorkout(res.data.workout);
        setExercises(res.data.exercises);
        setAmrapDuration(res.data.workout.duration_minutes);
        setTime(res.data.workout.duration_minutes * 60);
      })
      .catch((error) => {
        console.error("Error fetching workout:", error);
      });
  }, [workoutId]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (mode === "AMRAP") {
            if (prevTime <= 1) {
              triggerAlert();
              return 0;
            }
            return prevTime - 1;
          } else {
            if (prevTime % emomInterval === 0 && prevTime !== 0) {
              triggerAlert();
            }
            if (prevTime >= emomTotalDuration * 60) {
              setIsRunning(false);
              return prevTime;
            }
            return prevTime + 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, mode, emomInterval, emomTotalDuration]);

  const triggerAlert = () => {
    setFlash(true);
    audioRef.current.play();
    setTimeout(() => setFlash(false), 1000);
  };

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setTime(mode === "AMRAP" ? amrapDuration * 60 : 0);
    setTally(0);
  };
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTime(newMode === "AMRAP" ? amrapDuration * 60 : 0);
  };
  const handleTally = () => setTally((prev) => prev + 1);

  return (
    <div>
      {/* Toggle Switch for Layout */}
      <div className="layout-switch">
        <label>
          <input 
            type="checkbox" 
            checked={sideBySide} 
            onChange={() => setSideBySide(!sideBySide)} 
          />
          Side-by-Side View
        </label>
      </div>

      <div className={`timer-container ${sideBySide ? "side-by-side" : ""} ${flash ? "flash" : ""}`}>
        {/* Timer Section */}
        <div className="timer-section">
          <h2>Workout Timer</h2>

          {/* Mode Selector */}
          <div className="mode-switch">
            <button className={`mode-btn ${mode === "AMRAP" ? "active" : ""}`} onClick={() => handleModeChange("AMRAP")}>AMRAP</button>
            <button className={`mode-btn ${mode === "EMOM" ? "active" : ""}`} onClick={() => handleModeChange("EMOM")}>EMOM</button>
          </div>

          {/* Timer Settings */}
          <div className="settings">
            {mode === "AMRAP" && (
              <div>
                <label>AMRAP Duration (min):</label>
                <input type="number" value={amrapDuration} onChange={(e) => setAmrapDuration(Number(e.target.value))} />
                <button onClick={() => setTime(amrapDuration * 60)}>Set</button>
              </div>
            )}
            {mode === "EMOM" && (
              <div>
                <label>EMOM Interval (sec):</label>
                <input type="number" value={emomInterval} onChange={(e) => setEmomInterval(Number(e.target.value))} />
                <label>Total Duration (min):</label>
                <input type="number" value={emomTotalDuration} onChange={(e) => setEmomTotalDuration(Number(e.target.value))} />
              </div>
            )}
          </div>

          {/* Timer Display */}
          <div className="timer-display">
            {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
          </div>

          {/* Timer Controls */}
          <div className="controls">
            <button className="start-btn" onClick={handleStartPause}>{isRunning ? "Pause" : "Start"}</button>
            <button className="reset-btn" onClick={handleReset}>Reset</button>
          </div>

          {/* Tally Counter */}
          <div className="tally-counter">
            <h3>Reps / Rounds: {tally}</h3>
            <button className="tally-btn" onClick={handleTally}>+1</button>
          </div>
        </div>

        {/* Workout Details Section */}
        {workout && (
          <div className="workout-section">
            <h2>{workout.name}</h2>
            {!sideBySide && (
            <><p><strong>Description:</strong> {workout.description}</p><p><strong>Week:</strong> {workout.week} | <strong>Day:</strong> {workout.day}</p><p><strong>Duration:</strong> {workout.duration_minutes} minutes</p>

            <h3>Exercises</h3></>)}
            <ul className="exercise-list">
              {exercises.map((exerciseItem) => (
                <li key={exerciseItem.id} className="exercise-item">
                  <strong>{exerciseItem.exercise.name}</strong>
                  {!sideBySide && (<p>{exerciseItem.exercise.equipment} | {exerciseItem.exercise.exercise_type}</p>)}
                  <p><strong>Reps:</strong> {exerciseItem.reps || "N/A"} | <strong>Sets:</strong> {exerciseItem.sets || "N/A"} | <strong>Duration:</strong> {exerciseItem.duration_seconds ? `${exerciseItem.duration_seconds}s` : "N/A"}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutTimer;