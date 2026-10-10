import { formatCurrency, evaluateProductRisk } from '../../utils/riskCalculator'
import { LeafIcon, TagPercentIcon, RefreshCwIcon, AnalyticsIcon } from '../common/Icons'

export function AnalyticsView({ products }) {
  // Aggregate category breakdowns
  const categoryStats = products.reduce((acc, p) => {
    const cat = p.category || 'Other'
    if (!acc[cat]) {
      acc[cat] = { count: 0, totalValue: 0, atRiskCount: 0, atRiskValue: 0 }
    }
    const val = Number(p.quantity) * Number(p.price)
    acc[cat].count += 1
    acc[cat].totalValue += val

    const risk = evaluateProductRisk(p)
    if (risk.level !== 'Low') {
      acc[cat].atRiskCount += 1
      acc[cat].atRiskValue += val
    }
    return acc
  }, {})

  const categoryList = Object.entries(categoryStats).map(([cat, stats]) => ({
    category: cat,
    ...stats,
    riskRate: stats.count ? Math.round((stats.atRiskCount / stats.count) * 100) : 0,
  }))

  return (
    <div className="analytics-view-wrapper">
      {/* Top Banner */}
      <div className="analytics-hero-banner">
        <div>
          <span className="hero-eyebrow">STORE PERFORMANCE & ESG REPORT</span>
          <h2 className="hero-heading">Retail Waste & Margins Analytics</h2>
          <p className="hero-description">
            Quantify financial loss averted through timely markdown interventions and supply optimizations.
          </p>
        </div>
        <div className="hero-score-badge">
          <span className="score-label">Waste Diversion Score</span>
          <span className="score-number">88.4 / 100</span>
          <span className="score-sub">Top 10% Retail Efficiency</span>
        </div>
      </div>

      {/* KPI Trio */}
      <div className="analytics-kpi-grid">
        <div className="panel kpi-panel">
          <div className="kpi-icon-row">
            <span className="kpi-icon bg-emerald">
              <LeafIcon size={19} />
            </span>
            <span className="kpi-tag positive">+14% vs Last Month</span>
          </div>
          <span className="kpi-title">Avoided Food Waste</span>
          <strong className="kpi-value">420 kg</strong>
          <p className="kpi-subtext">Estimated perishables saved from disposal this quarter</p>
        </div>

        <div className="panel kpi-panel">
          <div className="kpi-icon-row">
            <span className="kpi-icon bg-amber">
              <TagPercentIcon size={19} />
            </span>
            <span className="kpi-tag positive">+22% Markdown Sales</span>
          </div>
          <span className="kpi-title">Recovered Capital</span>
          <strong className="kpi-value">₹24,850</strong>
          <p className="kpi-subtext">Revenue unlocked from items sold at targeted discounts</p>
        </div>

        <div className="panel kpi-panel">
          <div className="kpi-icon-row">
            <span className="kpi-icon bg-blue">
              <RefreshCwIcon size={19} />
            </span>
            <span className="kpi-tag neutral">94% Compliance</span>
          </div>
          <span className="kpi-title">FIFO Rotation Accuracy</span>
          <strong className="kpi-value">94.2%</strong>
          <p className="kpi-subtext">Front-facing shelf alignment for older batch inventory</p>
        </div>
      </div>

      {/* Category Risk Vulnerability Table */}
      <div className="panel analytics-table-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Category Expiry Vulnerability Matrix</h3>
            <p className="panel-subtitle">
              Monitor which departments require stricter inventory reorder buffers
            </p>
          </div>
          <span className="matrix-badge">
            <AnalyticsIcon size={15} />
            Catalog Breakdown
          </span>
        </div>

        <div className="table-responsive-container">
          <table className="inventory-data-table">
            <thead>
              <tr>
                <th scope="col">DEPARTMENT / CATEGORY</th>
                <th scope="col">SKUS TRACKED</th>
                <th scope="col">TOTAL STOCK VALUE</th>
                <th scope="col">ITEMS AT RISK</th>
                <th scope="col">VALUE AT RISK</th>
                <th scope="col">VULNERABILITY RATE</th>
              </tr>
            </thead>
            <tbody>
              {categoryList.map((cat) => (
                <tr key={cat.category}>
                  <td>
                    <strong>{cat.category}</strong>
                  </td>
                  <td>{cat.count} items</td>
                  <td>{formatCurrency(cat.totalValue)}</td>
                  <td>
                    <span className={cat.atRiskCount > 0 ? 'text-amber' : 'text-emerald'}>
                      {cat.atRiskCount} items
                    </span>
                  </td>
                  <td>{formatCurrency(cat.atRiskValue)}</td>
                  <td>
                    <div className="rate-cell">
                      <div className="rate-track">
                        <div
                          className={`rate-fill ${
                            cat.riskRate > 50
                              ? 'bg-rose'
                              : cat.riskRate > 25
                              ? 'bg-amber'
                              : 'bg-emerald'
                          }`}
                          style={{ width: `${Math.max(6, cat.riskRate)}%` }}
                        />
                      </div>
                      <span className="rate-text">{cat.riskRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
