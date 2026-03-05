// Props — stats computed via useMemo in App, passed down here
function Stats({ stats }) {
  const cards = [
    { label: 'Total',   value: stats.total,   cls: 'total'   },
    { label: 'Done',    value: stats.done,    cls: 'done'    },
    { label: 'Pending', value: stats.pending, cls: 'pending' },
  ]

  return (
    <div className="stats-cards">
      {cards.map(card => (
        <div key={card.label} className={`stat-card ${card.cls}`}>
          <span className="stat-number">{card.value}</span>
          <span className="stat-label">{card.label}</span>
        </div>
      ))}
    </div>
  )
}

export default Stats
