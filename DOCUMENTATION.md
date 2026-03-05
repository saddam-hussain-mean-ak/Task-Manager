# React Demo — Task Manager: Full Technical Documentation

---

## Table of Contents

0. [What We Built & Why](#0-what-we-built--why)
1. [Project Overview](#1-project-overview)
2. [File & Folder Structure](#2-file--folder-structure)
3. [Component Hierarchy & Data Flow](#3-component-hierarchy--data-flow)
4. [React Hooks — Deep Dive](#4-react-hooks--deep-dive)
5. [Core React Concepts — Deep Dive](#5-core-react-concepts--deep-dive)
6. [File-by-File Breakdown](#6-file-by-file-breakdown)
7. [State Architecture](#7-state-architecture)
8. [Feature Walkthroughs](#8-feature-walkthroughs)
9. [CSS Architecture (Dark/Light Theme)](#9-css-architecture-darklight-theme)
10. [Data Persistence](#10-data-persistence)

---

## 0. What We Built & Why

This section is a plain-language summary of every piece of this project — what it is, what it does, and why it exists.

---

### What is this app?

A **Task Manager** built entirely in React as a learning/demo project. Every feature was chosen because it naturally demonstrates a specific React concept. Nothing is forced — every hook and pattern solves a real problem inside the app.

---

### What We Developed — Feature by Feature

#### 1. Add Tasks with Priority

**What it is:** A form at the top with a text input, three priority buttons (Low / Medium / High), and an "Add Task" button.

**What it does:** Creates a new task object and prepends it to the task list. The task gets saved to localStorage immediately.

**Why we built it:** To demonstrate **controlled components** (the input's value is always driven by React state, not the DOM), **useRef** (auto-focus the input on page load and after adding), and **useCallback** (the submit handler is memoized).

---

#### 2. Task List with Priority Badges

**What it is:** A list of task cards. Each card shows the task title, a colour-coded priority badge (red/yellow/green), accumulated time spent, a Start button, and a delete button.

**What it does:** Renders the current filtered list of tasks. Completed tasks show with a strikethrough. The focused task glows with an accent border.

**Why we built it:** To demonstrate **lists & keys** (`tasks.map()` with `key={task.id}`), **props** (data passed from App → TaskList → TaskItem), and **conditional rendering** (strikethrough, time display only when > 0, Start button hidden on done tasks).

---

#### 3. Mark Tasks Done / Pending

**What it is:** A checkbox on the left of each task card.

**What it does:** Toggles `task.completed`. Completed tasks get a strikethrough, reduced opacity, and their Start button disappears. If the task was being timed, the Focus Timer auto-stops.

**Why we built it:** To demonstrate **event handling** (`onChange` on a checkbox), **state mutation via functional update** (`setTasks(prev => prev.map(...))`), and **side-effect coordination** (clearing focus timer when a task is marked done).

---

#### 4. Delete Tasks

**What it is:** A red ✕ button on the right of each task card.

**What it does:** Removes the task from the list permanently. If the deleted task was being timed, the Focus Timer auto-stops and resets.

**Why we built it:** To show **state updates with filtering** (`setTasks(prev => prev.filter(...))`), and **guard clauses in callbacks** (check if deleted task is focused before removing).

---

#### 5. Filter — All / Pending / Done

**What it is:** A full-width 3-segment button bar below the Add Task form.

**What it does:** Switches the visible task list between all tasks, only pending tasks, and only completed tasks. Does NOT delete tasks — just changes the view.

**Why we built it:** To demonstrate **useMemo** (the filtered list is only recomputed when `tasks` or `filter` changes, not on every render), **props** (filter state and the change handler passed down from App), and **derived state** (filtered list is computed from source data, never stored separately).

---

#### 6. Stats Bar (Total / Done / Pending)

**What it is:** Three cards at the top of the app showing counts.

**What it does:** Always shows the live count of total tasks, completed tasks, and pending tasks. Numbers are colour-coded: purple (total), green (done), amber (pending).

**Why we built it:** To demonstrate **useMemo** — the stats object `{ total, done, pending }` is computed from `tasks` but memoized so it doesn't recompute on unrelated state changes (like the timer ticking). Also demonstrates **props** — stats is passed as a single object prop to `Stats` and `Filter`.

---

#### 7. Focus Timer (per-task session tracking)

**What it is:** A timer card at the top with a large 00:00 display, Pause / Stop & Save / Reset buttons, and a label showing which task is being focused.

**What it does:**

- Idle state: shows "Click Start on any task to begin a session"
- When a task's Start button is clicked: auto-starts the timer for that task, shows the task name above the clock
- Pause: freezes the timer (session continues)
- Resume: restarts the count from where it was paused
- Stop & Save: adds the elapsed session seconds to the task's total `timeSpent`, resets the timer
- Reset: discards the session without saving, timer goes back to 00:00
- Browser tab title updates to show `MM:SS — Task Name` while running

**Why we built it:** This is the richest hook showcase in the app:

- `useRef` (×2) — one ref stores the interval ID (mutating it doesn't trigger re-render), another mirrors the `seconds` state value to solve the stale closure problem in `handleStopSave`
- `useEffect` (×4) — one auto-starts when a task is linked, one manages the interval, one updates the page title, one syncs `secondsRef`
- `useCallback` — all four handlers (Pause, Resume, StopSave, Reset) are memoized
- `useMemo` — `focusedTask` is derived in App from `tasks` + `focusedTaskId`

---

#### 8. Time Spent Display on Tasks

**What it is:** A small `⏱ 3m 12s` label under the priority badge on each task card. Only visible once the task has at least 1 second of recorded time.

**What it does:** Shows the total time accumulated across all focus sessions for that task. Persists across page reloads (stored in the task object in localStorage). While that task is actively being timed, the label pulses and turns accent colour.

**Why we built it:** To demonstrate **conditional rendering** (`timeSpent > 0 &&`), **derived display** (the `formatTime()` helper converts raw seconds to a human-readable string), and **state persistence** (timeSpent is part of the task object, saved to localStorage whenever tasks update).

---

#### 9. Dark / Light Theme Toggle

**What it is:** A pill-shaped button in the top-right corner of the header. Shows "☀ Light" in dark mode and "🌙 Dark" in light mode.

**What it does:** Switches the entire app between dark (default) and light colour schemes. The preference is saved to localStorage. The theme applies instantly via CSS custom properties — no flicker, no re-render of individual components.

**Why we built it:** To demonstrate the **Context API** — `ThemeContext` wraps the entire app so any component can access `{ dark, toggle }` without props being passed down. Also demonstrates **useEffect as a DOM side effect** (setting/removing `data-theme` attribute on `document.body`), and the **CSS custom property** pattern for zero-JS theming.

---

#### 10. Clear Completed Button

**What it is:** A red-bordered button that appears at the bottom of the task list only when there are completed tasks.

**What it does:** Removes all completed tasks in one click. If the currently focused task is completed, the Focus Timer is also cleared.

**Why we built it:** To demonstrate **conditional rendering** (`stats.done > 0 &&`), **bulk state mutation** (`setTasks(prev => prev.filter(t => !t.completed))`), and **coordinated state cleanup** (checking if the focused task is in the completed set before clearing).

---

## 1. Project Overview

A React demo app that intentionally exercises every core React fundamental in a real, working feature — not a toy example. Built with:

- **React 19** (Vite scaffold)
- **Pure CSS** (no UI library)
- **localStorage** (no backend)

### Features

| Feature                        | Purpose                     |
| ------------------------------ | --------------------------- |
| Add / Delete tasks             | Core CRUD                   |
| Priority (Low / Medium / High) | Visual categorisation       |
| Mark tasks done / pending      | Toggle state                |
| Filter (All / Pending / Done)  | Derived view                |
| Focus Timer linked to tasks    | useRef + useEffect demo     |
| Time spent per task            | Accumulated session seconds |
| Dark / Light theme             | Context API demo            |
| React Fundamentals Legend      | Self-documenting UI         |

---

## 2. File & Folder Structure

```
src/
├── main.jsx                  # React entry point, StrictMode wrapper
├── App.jsx                   # Root component — all shared state lives here
├── ThemeContext.jsx           # createContext + useContext + ThemeProvider
├── App.css                   # All component styles (CSS custom properties)
├── index.css                 # Global reset + CSS variable definitions (dark/light)
└── components/
    ├── Stats.jsx             # 3 stat cards (Total / Done / Pending)
    ├── FocusTimer.jsx        # Per-task focus timer (useRef, useEffect, useCallback)
    ├── TaskInput.jsx         # Add task form (controlled input, useRef, useCallback)
    ├── Filter.jsx            # All / Pending / Done filter bar
    ├── TaskList.jsx          # Maps tasks array → TaskItem components
    ├── TaskItem.jsx          # Single task row (checkbox, badge, time, Start, Delete)
```

---

## 3. Component Hierarchy & Data Flow

```
main.jsx
└── App (default export)
    └── ThemeProvider          [ThemeContext.jsx] — provides { dark, toggle }
        └── AppContent         [App.jsx] — owns ALL shared state
            ├── Stats          ← stats (useMemo object)
            ├── FocusTimer     ← focusedTask, onSaveSession, onClearFocus
            ├── TaskInput      ← onAdd
            ├── Filter         ← filter, onFilterChange, stats
            ├── TaskList       ← filteredTasks, onDelete, onToggle,
            │                     focusedTaskId, onStartFocus
            │   └── TaskItem   ← task, onDelete, onToggle,
            │                     isFocused, onStartFocus
            └── Legend         (no props — static)
```

### Props Flow Summary

Data flows **down** (parent → child via props). Events flow **up** (child calls callback prop).

```
AppContent
  tasks[]          → TaskList → TaskItem (task object)
  focusedTaskId    → TaskList → TaskItem (isFocused = focusedTaskId === task.id)
  onStartFocus()   → TaskList → TaskItem (called on Start button click)
  focusedTask      → FocusTimer (full task object, derived from focusedTaskId)
  stats{}          → Stats, Filter
  filter           → Filter
```

---

## 4. File-by-File Breakdown

### `main.jsx`

```jsx
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- `StrictMode` renders every component **twice** in development to detect side effects
  that aren't safe to re-run. It's removed in production builds.
- `createRoot` is the React 18+ API. The older `ReactDOM.render` is deprecated.

---

### `ThemeContext.jsx`

**Exports:** `ThemeProvider`, `useTheme`

**State:** `dark` (boolean)

**Pattern:** Provider wraps the tree, custom hook (`useTheme`) provides a clean API.

**Key decision — why `removeAttribute` instead of setting `data-theme="dark"`:**
The CSS in `index.css` uses `:root` for dark defaults. If we always set an attribute,
we'd need `[data-theme="dark"]` selectors for every dark color — doubling the CSS.
Instead, dark is the default, and `[data-theme="light"]` is the opt-in override. Clean.

---

### `App.jsx`

**The central state hub of the application.**

**State owned here:**

- `tasks[]` — source of truth for all task data
- `filter` — current filter tab selection
- `focusedTaskId` — which task is linked to the Focus Timer

**Why all state is in `App` (lifting state up):**
`Stats`, `Filter`, `FocusTimer`, and `TaskList` all need to read or modify `tasks`.
If tasks lived in `TaskList`, `Stats` couldn't read it. The solution is to **lift state
up** to the nearest common ancestor — which is `AppContent`.

**The `focusedTask` derivation pattern:**

```js
const focusedTask = useMemo(
  () => tasks.find((t) => t.id === focusedTaskId) || null,
  [tasks, focusedTaskId],
);
```

We store only the **ID** in state (minimal state). The full task object is **derived**
on demand. This avoids state duplication — if the task's text or timeSpent changes,
`focusedTask` automatically reflects the latest values because it re-derives from `tasks`.

**Auto-stop patterns (guard clauses in callbacks):**

```js
const deleteTask = useCallback((id) => {
  if (id === focusedTaskId) setFocusedTaskId(null); // stop timer if this task is focused
  setTasks(...)
}, [focusedTaskId])
```

When a running task is deleted, the Focus Timer would otherwise keep running with
a `focusedTask` that no longer exists. The guard prevents this inconsistency.

---

### `FocusTimer.jsx`

**The most technically complex component in the project.**

**Props received:**

- `focusedTask` — full task object or `null`
- `onSaveSession(taskId, seconds)` — called on Stop & Save
- `onClearFocus()` — called on Reset

**The stale closure problem and its solution:**

Problem:

```js
// If handleStopSave captured `seconds` from render scope:
const handleStopSave = useCallback(() => {
  onSaveSession(focusedTask.id, seconds); // seconds is STALE — always 0!
}, [focusedTask, onSaveSession]);
// We didn't list `seconds` in deps, so it captured the value from the first render
```

Solution:

```js
const secondsRef = useRef(0);

useEffect(() => {
  secondsRef.current = seconds; // always current
}, [seconds]);

const handleStopSave = useCallback(() => {
  onSaveSession(focusedTask.id, secondsRef.current); // reads latest value
}, [focusedTask, onSaveSession]);
```

The ref is mutated synchronously after every seconds increment. The callback reads
`secondsRef.current` which is always fresh, without needing `seconds` in its deps.

**Why `focusedTask?.id` and not `focusedTask` as a dependency:**

```js
useEffect(() => { ... }, [focusedTask?.id])
```

`focusedTask` is an object. Every time `tasks` is updated in `App` (e.g., `timeSpent`
increments every second), `focusedTask` gets a **new object reference** (because
`useMemo` returns a new object). If we used `[focusedTask]`, the effect would re-run
every second, resetting the timer. Using `focusedTask?.id` compares a primitive
(number), which only changes when the focused task actually switches.

---

### `TaskInput.jsx`

**Demonstrates:** controlled component, `useRef` for DOM focus, `useCallback`

**The auto-focus pattern:**

```js
const inputRef = useRef(null);
useEffect(() => {
  inputRef.current?.focus();
}, []);
// After add:
inputRef.current?.focus();
```

The `?.` optional chaining handles the case where ref isn't attached yet (safe pattern).

**Why `useCallback` here has `text` and `priority` in deps:**

```js
const handleSubmit = useCallback(
  (e) => {
    onAdd(text.trim(), priority);
  },
  [text, priority, onAdd],
);
```

`text` and `priority` are read directly in the function body (not via ref or functional
update). Without them in deps, `handleSubmit` would close over the initial values
(`''` and `'medium'`) and always submit an empty task.

---

### `TaskList.jsx`

**Pure pass-through component.** Its only job is to map the `tasks` array to `TaskItem`
components. It also handles the empty state.

**The key computation happens here, not in `TaskItem`:**

```js
isFocused={focusedTaskId === task.id}
```

`TaskItem` receives a simple boolean. It doesn't need to know what `focusedTaskId` is
or how focus management works. This is a deliberate API boundary.

---

### `TaskItem.jsx`

**Props:** `task`, `onDelete`, `onToggle`, `isFocused`, `onStartFocus`

**The `formatTime` helper:**

```js
function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
```

Shows human-readable format: `45s`, `3m 12s`, `1h 05m`. Only shows hours when there are hours.

**The isFocused conditional rendering:**

```jsx
{
  isFocused ? "▶ Active" : "Start";
}
```

The button text changes to show the task is actively being timed. Combined with the
`.focused` CSS class, it turns purple/filled when active.

---

### `Stats.jsx`

**Purely presentational.** No state, no hooks. Receives `stats` object and renders cards.

The `cards` array is defined inside the function (not at module level) because it
references `stats` values. Defined at module level would require a function anyway.

---

### `Filter.jsx`

**Purely presentational.** The `filters` array is a local constant — fixed data that
never changes. Key insight: `stats` is received but actually not used in the current
version (the filter labels are just "All", "Pending", "Done" without counts). It's
kept in props for easy extension.

---

## 5. State Architecture

### Complete State Map

| State           | Location           | Type                           | Persisted          |
| --------------- | ------------------ | ------------------------------ | ------------------ |
| `tasks`         | `App.jsx`          | `Array<Task>`                  | Yes (localStorage) |
| `filter`        | `App.jsx`          | `"all" \| "pending" \| "done"` | No                 |
| `focusedTaskId` | `App.jsx`          | `number \| null`               | No                 |
| `dark`          | `ThemeContext.jsx` | `boolean`                      | Yes (localStorage) |
| `text`          | `TaskInput.jsx`    | `string`                       | No                 |
| `priority`      | `TaskInput.jsx`    | `"low" \| "medium" \| "high"`  | No                 |
| `error`         | `TaskInput.jsx`    | `string`                       | No                 |
| `seconds`       | `FocusTimer.jsx`   | `number`                       | No                 |
| `running`       | `FocusTimer.jsx`   | `boolean`                      | No                 |

### Task Object Shape

```js
{
  id:        number,   // Date.now() — unique, used as React key
  text:      string,   // task title
  completed: boolean,  // done/pending toggle
  priority:  "low" | "medium" | "high",
  timeSpent: number    // total seconds spent across all sessions
}
```

### Derived Values (never stored in state)

```js
// Derived from tasks + focusedTaskId
focusedTask = tasks.find(t => t.id === focusedTaskId)

// Derived from tasks
stats = { total, done, pending }

// Derived from tasks + filter
filteredTasks = tasks.filter(...)

// Derived from task.timeSpent (in TaskItem)
formattedTime = formatTime(task.timeSpent)
```

---

## 6. Feature Walkthroughs

### Add a Task

1. User types in `TaskInput` → `text` state updates (controlled input)
2. User selects priority → `priority` state updates
3. User submits form → `handleSubmit` fires
4. `onAdd(text, priority)` calls `addTask` in `App`
5. `addTask` creates `{ id: Date.now(), text, completed: false, priority, timeSpent: 0 }`
6. `setTasks(prev => [newTask, ...prev])` — prepends to array
7. `useEffect` detects `tasks` changed → `localStorage.setItem(...)`
8. React re-renders: `Stats` (total + 1), `TaskList` (new item appears)

### Start a Focus Session

1. User clicks "Start" on a TaskItem
2. `onStartFocus(task.id)` fires → `startFocus(id)` in App
3. `setFocusedTaskId(id)` updates state
4. `focusedTask` (useMemo) recomputes: finds task object
5. `FocusTimer` receives new `focusedTask` prop → re-renders
6. `useEffect([focusedTask?.id])` fires: resets `seconds=0`, `setRunning(true)`
7. `useEffect([running])` fires: starts `setInterval`
8. Every second: `setSeconds(s => s + 1)`, page title updates
9. Task card gets `.timer-running` class (accent border glow)

### Stop & Save a Session

1. User clicks "Stop & Save" in FocusTimer
2. `handleStopSave` fires: reads `secondsRef.current` (current elapsed seconds)
3. Calls `onSaveSession(focusedTask.id, secondsRef.current)`
4. `saveSession` in App: `setTasks(prev => prev.map(t => t.id === id ? { ...t, timeSpent: t.timeSpent + seconds } : t))`
5. `setFocusedTaskId(null)` — clears focus
6. `focusedTask` becomes `null` → FocusTimer shows idle state
7. `useEffect([focusedTask?.id])` fires: resets to 00:00
8. `tasks` changed → localStorage updated
9. TaskItem shows updated `⏱ Xm Ys`

### Toggle Dark/Light

1. User clicks theme button in header
2. `toggle()` from `useTheme()` fires → `setDark(d => !d)`
3. `useEffect([dark])` in ThemeProvider fires
4. If dark: `document.body.removeAttribute('data-theme')`
5. If light: `document.body.setAttribute('data-theme', 'light')`
6. CSS `[data-theme="light"]` selector activates light variable overrides
7. All CSS custom properties cascade to their light values instantly
8. `localStorage.setItem('theme', ...)` persists the choice

---

## 7. CSS Architecture (Dark/Light Theme)

### Structure

```css
/* index.css */
:root {
  /* Dark values are DEFAULT — no attribute needed */
  --bg-body: #0b0b1e;
  --bg-card: #13132b;
  --accent: #6366f1;
  /* ... */
}

[data-theme="light"] {
  /* Light overrides — only active when body has data-theme="light" */
  --bg-body: #f0f2f5;
  --bg-card: #ffffff;
  /* ... */
}
```

All component styles use the variables:

```css
.container {
  background: var(--bg-container);
}
.task-item {
  background: var(--bg-task);
  border-color: var(--border-task);
}
```

This means toggling dark/light mode requires **zero JavaScript changes to components**.
One DOM attribute change causes the entire app to re-theme via CSS cascade.

### Priority Badge Light Overrides

```css
/* Dark (default in :root) */
.priority-high {
  background: #3b0d0d;
  color: #fca5a5;
}

/* Light override — scoped to body[data-theme="light"] */
[data-theme="light"] .priority-high {
  background: #fee2e2;
  color: #dc2626;
}
```

The selector `[data-theme="light"] .priority-high` works because `[data-theme="light"]`
is on `<body>` and `.priority-high` is a descendant of body — CSS descendant selector.

---

## 8. Data Persistence

### What persists across page reloads

| Data                                        | Key       | Value                 |
| ------------------------------------------- | --------- | --------------------- |
| All tasks (text, done, priority, timeSpent) | `"tasks"` | JSON string           |
| Theme preference                            | `"theme"` | `"dark"` or `"light"` |

### What does NOT persist

- `filter` — resets to `"all"` on reload (intentional — sensible default)
- `focusedTaskId` — timer session ends on reload (intentional)
- `seconds` — current session time is lost on reload (FocusTimer is volatile)

### Why task saving is safe during timer sessions

The Focus Timer does NOT update `tasks` every second. It only increments `secondsRef.current`
locally. `tasks` is only updated in `saveSession` when the user clicks "Stop & Save".
This means localStorage is not hammered once per second — it's only written when the
task list actually changes (add, delete, toggle, save session).
