// Props + Lists & Keys + conditional class
function Filter({ filter, onFilterChange, stats }) {
  const filters = [
    { value: 'all',     label: 'All'     },
    { value: 'pending', label: 'Pending' },
    { value: 'done',    label: 'Done'    },
  ]

  return (
    <div className="filter-bar">
      {filters.map(f => (
        <button
          key={f.value}
          className={`filter-btn ${filter === f.value ? 'active' : ''}`}
          onClick={() => onFilterChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

export default Filter
