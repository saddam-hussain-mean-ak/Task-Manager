import { useState, useRef, useEffect, useCallback } from "react";

// useRef — auto-focus input on mount & after add
// useCallback — stable submit handler
// Controlled component — value + onChange
function TaskInput({ onAdd }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  const inputRef = useRef(null); // useRef — DOM access without re-render

  useEffect(() => {
    inputRef.current?.focus(); // useEffect — focus on mount
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!text.trim()) {
        setError("Task cannot be empty!");
        return;
      }
      onAdd(text.trim(), priority);
      setText("");
      setPriority("medium");
      setError("");
      inputRef.current?.focus(); // useRef — re-focus after adding
    },
    [text, priority, onAdd],
  );

  return (
    <div className="section-card">
      <div className="section-label">
        <span>+ ADD TASK</span>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="task-input"
          placeholder="Enter task title..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError("");
          }}
        />

        {/* Priority — segmented button group */}
        <div className="priority-group">
          {["low", "medium", "high"].map((p) => (
            <button
              key={p}
              type="button"
              className={`priority-btn ${priority === p ? "active" : ""}`}
              onClick={() => setPriority(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {error && <span className="input-error">{error}</span>}

        <button type="submit" className="add-btn">
          Add Task
        </button>
      </form>
    </div>
  );
}

export default TaskInput;
