import { useState, useEffect, useRef, useCallback } from "react";

// useRef — interval ID + secondsRef (avoids stale closure in handleStopSave)
// useEffect — auto-start when focusedTask changes, manage interval, update page title
// useCallback — stable Pause/Resume/StopSave/Reset handlers
function FocusTimer({ focusedTask, onSaveSession, onClearFocus }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);
  const secondsRef = useRef(0); // mirrors seconds state for use in callbacks

  // Keep secondsRef in sync so handleStopSave always reads current value
  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  // useEffect — auto-start/reset whenever the linked task changes
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (focusedTask) {
      setSeconds(0);
      secondsRef.current = 0;
      setRunning(true);
    } else {
      setRunning(false);
      setSeconds(0);
    }
  }, [focusedTask?.id]); // re-run only when the focused task ID changes

  // useEffect — manage interval based on running state
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  // useEffect — update browser tab title with current task name
  useEffect(() => {
    if (running && focusedTask) {
      const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
      const ss = String(seconds % 60).padStart(2, "0");
      document.title = `${mm}:${ss} — ${focusedTask.text}`;
    } else {
      document.title = "React Demo";
    }
    return () => {
      document.title = "React Demo";
    };
  }, [seconds, running, focusedTask]);

  // useCallback — save session time to the task, then clear focus
  const handleStopSave = useCallback(() => {
    setRunning(false);
    onSaveSession(focusedTask.id, secondsRef.current);
    // onSaveSession sets focusedTaskId=null in App
    // → focusedTask becomes null → useEffect resets seconds
  }, [focusedTask, onSaveSession]);

  // useCallback — discard session without saving
  const handleReset = useCallback(() => {
    onClearFocus();
  }, [onClearFocus]);

  const handlePause = useCallback(() => setRunning(false), []);
  const handleResume = useCallback(() => setRunning(true), []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="section-card">
      <div className="section-label">
        <span>⏱ FOCUS TIMER</span>
      </div>

      {/* Conditional rendering — show task name or idle hint */}
      {focusedTask ? (
        <div className="focus-task-name">
          <span className="focus-task-label">Focusing on:</span>
          <span className="focus-task-text">{focusedTask.text}</span>
        </div>
      ) : (
        <p className="timer-hint">Click Start on any task to begin a session</p>
      )}

      <div className={`timer-display ${running ? "running" : ""}`}>
        {mm}:{ss}
      </div>

      <div className="timer-controls">
        {focusedTask ? (
          <>
            {running ? (
              <button className="timer-btn pause" onClick={handlePause}>
                Pause
              </button>
            ) : (
              <button className="timer-btn start" onClick={handleResume}>
                Resume
              </button>
            )}
            <button className="timer-btn stop-save" onClick={handleStopSave}>
              Stop & Save
            </button>
            <button className="timer-btn reset" onClick={handleReset}>
              Reset
            </button>
          </>
        ) : (
          <button className="timer-btn reset" disabled>
            No task selected
          </button>
        )}
      </div>
    </div>
  );
}

export default FocusTimer;
