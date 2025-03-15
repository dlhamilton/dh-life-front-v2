import React, { useState, useEffect, useRef } from "react";
import "../../assets/WorkoutTimer.css"; // ✅ Import CSS for styling
import beepSound from "../../assets/beep.mp3"; // ✅ Add a beep sound

const WorkoutTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("AMRAP"); // "AMRAP" or "EMOM"
  const [amrapDuration, setAmrapDuration] = useState(10); // Default 10 min
  const [emomInterval, setEmomInterval] = useState(60); // Default 60 sec
  const [emomTotalDuration, setEmomTotalDuration] = useState(10); // Default 10 min
  const [tally, setTally] = useState(0);
  const [flash, setFlash] = useState(false);
  const audioRef = useRef(new Audio(beepSound)); // Sound reference

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (mode === "AMRAP") {
            if (prevTime <= 1) {
              triggerAlert();
              return 0; // Stop at zero
            }
            return prevTime - 1; // Count down
          } else {
            if (prevTime % emomInterval === 0 && prevTime !== 0) {
              triggerAlert(); // Play beep every EMOM interval
            }
            if (prevTime >= emomTotalDuration * 60) {
              setIsRunning(false); // Stop after EMOM total duration
              return prevTime;
            }
            return prevTime + 1; // Count up for EMOM
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
    setTimeout(() => setFlash(false), 1000); // Remove flash after 1 sec
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

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

  const handleTally = () => {
    setTally((prev) => prev + 1);
  };

  return (
    <div className={`timer-container ${flash ? "flash" : ""}`}>
      <h2>Workout Timer</h2>

      {/* Mode Selector */}
      <div className="mode-switch">
        <button
          className={`mode-btn ${mode === "AMRAP" ? "active" : ""}`}
          onClick={() => handleModeChange("AMRAP")}
        >
          AMRAP
        </button>
        <button
          className={`mode-btn ${mode === "EMOM" ? "active" : ""}`}
          onClick={() => handleModeChange("EMOM")}
        >
          EMOM
        </button>
      </div>

      {/* Timer Settings */}
      <div className="settings">
        {mode === "AMRAP" && (
          <div>
            <label>AMRAP Duration (min):</label>
            <input
              type="number"
              value={amrapDuration}
              onChange={(e) => setAmrapDuration(Number(e.target.value))}
            />
            <button onClick={() => setTime(amrapDuration * 60)}>Set</button>
          </div>
        )}

        {mode === "EMOM" && (
          <div>
            <label>EMOM Interval (sec):</label>
            <input
              type="number"
              value={emomInterval}
              onChange={(e) => setEmomInterval(Number(e.target.value))}
            />
            <label>Total Duration (min):</label>
            <input
              type="number"
              value={emomTotalDuration}
              onChange={(e) => setEmomTotalDuration(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      {/* Timer Display */}
      <div className="timer-display">
        {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
      </div>

      {/* Timer Controls */}
      <div className="controls">
        <button className="start-btn" onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button className="reset-btn" onClick={handleReset}>Reset</button>
      </div>

      {/* Tally Counter */}
      <div className="tally-counter">
        <h3>Reps / Rounds: {tally}</h3>
        <button className="tally-btn" onClick={handleTally}>+1</button>
      </div>
    </div>
  );
};

export default WorkoutTimer;