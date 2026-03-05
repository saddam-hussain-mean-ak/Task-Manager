import { useState, useEffect, useCallback, useMemo } from "react";
import { ThemeProvider, useTheme } from "./ThemeContext";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Filter from "./components/Filter";
import Stats from "./components/Stats";
import FocusTimer from "./components/FocusTimer";
import "./App.css";

function AppContent() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all");

  // Which task is currently linked to the Focus Timer
  const [focusedTaskId, setFocusedTaskId] = useState(null);

  // useContext — read theme from ThemeContext
  const { dark, toggle } = useTheme();

  // useEffect — persist tasks (timeSpent included)
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // useMemo — derive the full focused task object for FocusTimer
  const focusedTask = useMemo(
    () => tasks.find((t) => t.id === focusedTaskId) || null,
    [tasks, focusedTaskId],
  );

  // useCallback — link a task to the Focus Timer (auto-starts it)
  const startFocus = useCallback((taskId) => {
    setFocusedTaskId(taskId);
  }, []);

  // useCallback — called by FocusTimer on "Stop & Save": adds session seconds to task
  const saveSession = useCallback((taskId, seconds) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, timeSpent: (t.timeSpent || 0) + seconds } : t,
      ),
    );
    setFocusedTaskId(null);
  }, []);

  // useCallback — called by FocusTimer on "Reset": discard session
  const clearFocus = useCallback(() => {
    setFocusedTaskId(null);
  }, []);

  // useCallback — stable handlers
  const addTask = useCallback((text, priority) => {
    setTasks((prev) => [
      { id: Date.now(), text, completed: false, priority, timeSpent: 0 },
      ...prev,
    ]);
  }, []);

  const deleteTask = useCallback(
    (id) => {
      // If the deleted task is focused, clear the focus timer
      if (id === focusedTaskId) setFocusedTaskId(null);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [focusedTaskId],
  );

  const toggleTask = useCallback(
    (id) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const completed = !t.completed;
            // Auto-clear focus timer when task is marked done
            if (completed && id === focusedTaskId) setFocusedTaskId(null);
            return { ...t, completed };
          }
          return t;
        }),
      );
    },
    [focusedTaskId],
  );

  const clearCompleted = useCallback(() => {
    setTasks((prev) => {
      const completedIds = prev.filter((t) => t.completed).map((t) => t.id);
      if (completedIds.includes(focusedTaskId)) setFocusedTaskId(null);
      return prev.filter((t) => !t.completed);
    });
  }, [focusedTaskId]);

  // useMemo — derived stats
  const stats = useMemo(
    () => ({
      total: tasks.length,
      done: tasks.filter((t) => t.completed).length,
      pending: tasks.filter((t) => !t.completed).length,
    }),
    [tasks],
  );

  // useMemo — filtered list
  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) =>
        filter === "pending"
          ? !task.completed
          : filter === "done"
            ? task.completed
            : true,
      ),
    [tasks, filter],
  );

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <span className="app-icon">⚛</span>
            <div>
              <h1 className="title">React Demo</h1>
            </div>
          </div>
          <button className="theme-toggle" onClick={toggle}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Stats — useMemo result passed as props */}
        <Stats stats={stats} />

        {/* Focus Timer — driven by focusedTask prop from App */}
        <FocusTimer
          focusedTask={focusedTask}
          onSaveSession={saveSession}
          onClearFocus={clearFocus}
        />

        {/* Add Task — controlled input + useRef + useCallback */}
        <TaskInput onAdd={addTask} />

        {/* Filter — props */}
        <Filter filter={filter} onFilterChange={setFilter} stats={stats} />

        {/* Task List — lists & keys + conditional rendering */}
        <TaskList
          tasks={filteredTasks}
          onDelete={deleteTask}
          onToggle={toggleTask}
          focusedTaskId={focusedTaskId}
          onStartFocus={startFocus}
        />

        {stats.done > 0 && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear Completed ({stats.done})
          </button>
        )}

        {tasks.length === 0 && (
          <p className="empty-msg">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
