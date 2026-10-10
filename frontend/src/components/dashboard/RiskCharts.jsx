import { useState } from 'react'
import { formatCurrency } from '../../utils/riskCalculator'

const WEEKLY_PROJECTION = [
  { day: 'Mon', totalStock: 64, riskStock: 22 },
  { day: 'Tue', totalStock: 78, riskStock: 29 },
  { day: 'Wed', totalStock: 70, riskStock: 24 },
  { day: 'Thu', totalStock: 85, riskStock: 36 },
  { day: 'Fri', totalStock: 72, riskStock: 28 },
  { day: 'Sat', totalStock: 95, riskStock: 44 },
  { day: 'Sun', totalStock: 80, riskStock: 31 },
]

export function RiskCharts({ metrics, onFilterRisk }) {
  const [hoveredDay, setHoveredDay] = useState(null)
  const {
    totalProducts,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    estimatedValueAtRisk,
    potentialWasteReductionValue,
  } = metrics

  const highPct = totalProducts ? Math.round((highRiskCount / totalProducts) * 100) : 0
  const medPct = totalProducts ? Math.round((mediumRiskCount / totalProducts) * 100) : 0
  const lowPct = totalProducts ? Math.round((lowRiskCount / totalProducts) * 100) : 0

  return (
    <div className="risk-charts-container">
      {/* Chart 1: Weekly Expiry Risk Velocity Chart */}
      <div className="panel chart-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Weekly Risk & Stock Movement</h3>
            <p className="panel-subtitle">
              Comparison of total inventory volume vs. near-expiry units across sales days
            </p>
          </div>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot color-healthy" />
              Healthy Stock
            </span>
            <span className="legend-item">
              <span className="legend-dot color-risk" />
              At-Risk Stock
            </span>
          </div>
        </div>

        {/* Responsive Custom SVG / CSS Bar Chart */}
        <div className="interactive-chart-wrap">
          <div className="chart-y-axis">
            <span>100u</span>
            <span>75u</span>
            <span>50u</span>
            <span>25u</span>
            <span>0u</span>
          </div>

          <div className="chart-bars-area">
            {WEEKLY_PROJECTION.map((item) => {
              const isHovered = hoveredDay?.day === item.day
              return (
                <div
                  key={item.day}
                  className={`chart-bar-group ${isHovered ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredDay(item)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div className="bar-track">
                    {/* Healthy bar */}
                    <div
                      className="bar-fill bar-healthy"
                      style={{ height: `${item.totalStock}%` }}
                    />
                    {/* At risk bar */}
                    <div
                      className="bar-fill bar-risk"
                      style={{ height: `${item.riskStock}%` }}
                    />
                  </div>
                  <span className="bar-label">{item.day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dynamic Tooltip / Legend info */}
        <div className="chart-footer-note">
          {hoveredDay ? (
            <span className="active-chart-reading">
              <strong>{hoveredDay.day} Projected:</strong> {hoveredDay.totalStock} total units ·{' '}
              <span className="text-amber">{hoveredDay.riskStock} units needing markdown</span>
            </span>
          ) : (
            <span>
              ℹ️ Projected demo simulation based on historic retail sales velocity
            </span>
          )}
        </div>
      </div>

      {/* Chart 2: Expiry Risk & Waste Reduction Distribution */}
      <div className="panel risk-breakdown-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Expiry Risk Snapshot</h3>
            <p className="panel-subtitle">Live categorization of current store inventory</p>
          </div>
        </div>

        {/* Progress Breakdown Bars */}
        <div className="risk-progress-list">
          {/* High Risk */}
          <div
            className="risk-progress-item clickable-risk-row"
            onClick={() => onFilterRisk('High')}
            title="Filter by High Risk"
          >
            <div className="risk-progress-label-row">
              <div className="risk-label-left">
                <span className="risk-mini-dot dot-high" />
                <strong>High Urgency (0–2 Days)</strong>
              </div>
              <span className="risk-count-badge badge-high">
                {highRiskCount} products ({highPct}%)
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-high" style={{ width: `${highPct}%` }} />
            </div>
          </div>

          {/* Medium Risk */}
          <div
            className="risk-progress-item clickable-risk-row"
            onClick={() => onFilterRisk('Medium')}
            title="Filter by Medium Risk"
          >
            <div className="risk-progress-label-row">
              <div className="risk-label-left">
                <span className="risk-mini-dot dot-medium" />
                <strong>Medium Urgency (3–5 Days)</strong>
              </div>
              <span className="risk-count-badge badge-medium">
                {mediumRiskCount} products ({medPct}%)
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-medium" style={{ width: `${medPct}%` }} />
            </div>
          </div>

          {/* Low Risk */}
          <div
            className="risk-progress-item clickable-risk-row"
            onClick={() => onFilterRisk('Low')}
            title="Filter by Low Risk"
          >
            <div className="risk-progress-label-row">
              <div className="risk-label-left">
                <span className="risk-mini-dot dot-low" />
                <strong>Healthy Shelf Life (6+ Days)</strong>
              </div>
              <span className="risk-count-badge badge-low">
                {lowRiskCount} products ({lowPct}%)
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill fill-low" style={{ width: `${lowPct}%` }} />
            </div>
          </div>
        </div>

        {/* Potential Waste Reduction Comparison */}
        <div className="waste-recovery-box">
          <div className="recovery-header">
            <span className="recovery-title">Waste Reduction Potential</span>
            <span className="recovery-target">Impact Analysis</span>
          </div>
          <div className="recovery-bar-dual">
            <div
              className="recovery-segment segment-preventable"
              style={{ width: '68%' }}
              title="Preventable Waste: 68%"
            >
              <span>68% Preventable</span>
            </div>
            <div
              className="recovery-segment segment-residual"
              style={{ width: '32%' }}
              title="Estimated Spoilage without action: 32%"
            >
              <span>32% Baseline</span>
            </div>
          </div>
          <p className="recovery-caption">
            ReValueAI markdowns can salvage{' '}
            <strong>{formatCurrency(potentialWasteReductionValue)}</strong> out of{' '}
            <strong>{formatCurrency(estimatedValueAtRisk)}</strong> potential waste.
          </p>
        </div>
      </div>
    </div>
  )
}
