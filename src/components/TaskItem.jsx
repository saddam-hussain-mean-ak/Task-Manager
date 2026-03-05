// Props + conditional rendering + event handling

const PRIORITY = {
  high:   { label: 'High',   cls: 'priority-high'   },
  medium: { label: 'Medium', cls: 'priority-medium'  },
  low:    { label: 'Low',    cls: 'priority-low'     },
}

function formatTime(secs) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) {
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`
  }
  if (m > 0) {
    return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
  }
  return `${String(s).padStart(2, '0')}s`
}

function TaskItem({ task, onDelete, onToggle, isFocused, onStartFocus }) {
  const p = PRIORITY[task.priority] || PRIORITY.medium
  const timeSpent = task.timeSpent || 0

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''} ${isFocused ? 'timer-running' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />

      <div className="task-body">
        {/* Conditional rendering — strikethrough when done */}
        <span className="task-text">{task.text}</span>
        <div className="task-meta">
          <span className={`priority-badge ${p.cls}`}>{p.label}</span>
          {/* Time spent — read-only, shows total hours worked on this task */}
          {timeSpent > 0 && (
            <span className={`task-time ${isFocused ? 'active' : ''}`}>
              ⏱ {formatTime(timeSpent)}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        {/* Conditional rendering — only show Start on non-completed tasks */}
        {!task.completed && (
          <button
            className={`task-timer-btn start ${isFocused ? 'focused' : ''}`}
            onClick={() => onStartFocus(task.id)}
            title={isFocused ? 'Currently in focus' : 'Start focus session for this task'}
          >
            {isFocused ? '▶ Active' : 'Start'}
          </button>
        )}
        <button className="delete-btn" onClick={() => onDelete(task.id)}>✕</button>
      </div>
    </li>
  )
}

export default TaskItem
