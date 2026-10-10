import { formatCurrency } from '../../utils/riskCalculator'
import {
  InventoryIcon,
  AlertIcon,
  LeafIcon,
  TagPercentIcon,
} from '../common/Icons'

export function SummaryCards({ metrics, onFilterRisk }) {
  const {
    totalProducts,
    atRiskProducts,
    highRiskCount,
    mediumRiskCount,
    estimatedValueAtRisk,
    potentialWasteReductionValue,
    wasteReductionPercent,
  } = metrics

  return (
    <div className="summary-cards-grid">
      {/* 1. Total Products */}
      <div className="summary-card card-total">
        <div className="card-top">
          <span className="card-label">Total Products</span>
          <div className="card-icon-wrap icon-green">
            <InventoryIcon size={20} />
          </div>
        </div>
        <div className="card-metric-row">
          <span className="card-big-number">{totalProducts}</span>
          <span className="card-unit">active SKUs</span>
        </div>
        <div className="card-footer">
          <span className="indicator-pill green-pill">Catalog Active</span>
          <span className="card-footnote">Tracked in session</span>
        </div>
      </div>

      {/* 2. At-Risk Products */}
      <div
        className="summary-card card-risk clickable-card"
        onClick={() => onFilterRisk('AtRisk')}
        title="Click to view at-risk products in inventory"
        role="button"
        tabIndex={0}
      >
        <div className="card-top">
          <span className="card-label">At-Risk Products</span>
          <div className="card-icon-wrap icon-amber">
            <AlertIcon size={20} />
          </div>
        </div>
        <div className="card-metric-row">
          <span className="card-big-number text-amber">{atRiskProducts}</span>
          <span className="card-unit">items urgent</span>
        </div>
        <div className="card-footer">
          <span className="indicator-pill amber-pill">
            {highRiskCount} High · {mediumRiskCount} Medium
          </span>
          <span className="card-footnote link-hint">Filter table ↗</span>
        </div>
      </div>

      {/* 3. Estimated Value at Risk */}
      <div className="summary-card card-value">
        <div className="card-top">
          <span className="card-label">Estimated Value at Risk</span>
          <div className="card-icon-wrap icon-rose">
            <TagPercentIcon size={20} />
          </div>
        </div>
        <div className="card-metric-row">
          <span className="card-big-number text-rose">
            {formatCurrency(estimatedValueAtRisk)}
          </span>
        </div>
        <div className="card-footer">
          <span className="indicator-pill rose-pill">Spoilage Risk</span>
          <span className="card-footnote">Surplus units × unit price</span>
        </div>
      </div>

      {/* 4. Waste Reduction */}
      <div className="summary-card card-reduction">
        <div className="card-top">
          <span className="card-label">Waste Reduction Potential</span>
          <div className="card-icon-wrap icon-emerald">
            <LeafIcon size={20} />
          </div>
        </div>
        <div className="card-metric-row">
          <span className="card-big-number text-emerald">
            {formatCurrency(potentialWasteReductionValue)}
          </span>
          <span className="card-badge-percent">{wasteReductionPercent}%</span>
        </div>
        <div className="card-footer">
          <span className="indicator-pill emerald-pill">Recoverable Value</span>
          <span className="card-footnote">Via markdowns & FIFO</span>
        </div>
      </div>
    </div>
  )
}
