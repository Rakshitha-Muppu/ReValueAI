export function RiskBadge({ level = 'Low', daysLeft = null, showDays = true }) {
  const normalized = level.toLowerCase()

  let labelText = level
  if (showDays && daysLeft !== null) {
    if (daysLeft < 0) {
      labelText = `${level} (Expired)`
    } else if (daysLeft === 0) {
      labelText = `${level} (Today)`
    } else if (daysLeft === 1) {
      labelText = `${level} (1 day left)`
    } else {
      labelText = `${level} (${daysLeft}d left)`
    }
  }

  return (
    <span className={`risk-pill risk-${normalized}`} title={`Expiry Risk Level: ${level}`}>
      <span className="risk-indicator-dot" />
      <span className="risk-pill-text">{labelText}</span>
    </span>
  )
}
