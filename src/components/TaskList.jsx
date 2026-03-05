import TaskItem from './TaskItem'

// Demonstrates: lists & keys, props, component composition
function TaskList({ tasks, onDelete, onToggle, focusedTaskId, onStartFocus }) {
  if (tasks.length === 0) {
    return <p className="no-tasks">No tasks to show.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
          isFocused={focusedTaskId === task.id}
          onStartFocus={onStartFocus}
        />
      ))}
    </ul>
  )
}

export default TaskList
