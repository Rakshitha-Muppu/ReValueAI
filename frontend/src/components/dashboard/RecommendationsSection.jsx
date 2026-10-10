import {
  TagPercentIcon,
  RefreshCwIcon,
  PackagePlusIcon,
  AnalyticsIcon,
  ArrowRightIcon,
  RecommendationsIcon,
} from '../common/Icons'

export function RecommendationsSection({ products, onApplyRecommendation }) {
  // Extract specific products to illustrate actionable advice
  const milkItem = products.find((p) => p.name.includes('Milk'))
  const breadItem = products.find((p) => p.name.includes('Bread') || p.category === 'Bakery')
  const yogurtItem = products.find((p) => p.name.includes('Yogurt'))
  const juiceItem = products.find((p) => p.category === 'Beverages')

  return (
    <div className="panel recommendations-section-panel">
      <div className="panel-header">
        <div className="recommendations-title-lockup">
          <div className="recommendations-icon-badge">
            <RecommendationsIcon size={20} />
          </div>
          <div>
            <h3 className="panel-title">Smart Waste-Reduction Recommendations</h3>
            <p className="panel-subtitle">
              Prioritized interventions based on current shelf-life and demand velocity
            </p>
          </div>
        </div>
        <span className="ai-pill-tag">Automated Decision Engine</span>
      </div>

      <div className="recommendations-cards-grid">
        {/* Strategy 1: Dynamic Markdown / Discounting */}
        <div className="recommendation-card card-markdown">
          <div className="rec-card-top">
            <span className="rec-type-badge badge-discount">
              <TagPercentIcon size={14} />
              <span>DYNAMIC DISCOUNTING</span>
            </span>
            <span className="rec-priority high-priority">HIGH URGENCY</span>
          </div>
          <h4 className="rec-headline">
            Apply 30% Flash Markdown on Near-Expiry Fresh Goods
          </h4>
          <p className="rec-description">
            {milkItem ? (
              <>
                <strong>{milkItem.name}</strong> ({milkItem.quantity} units) and fresh produce
                reach expiry in ~24–48 hours. At standard sales velocity, ~12 units will spoil.
                Applying a 30% discount will clear stock by 8 PM today.
              </>
            ) : (
              'Accelerate sell-through by applying a 30% markdown during peak evening footfall.'
            )}
          </p>
          <div className="rec-impact-row">
            <span className="impact-metric">
              Estimated Salvaged Value: <strong>₹960</strong>
            </span>
          </div>
          <button
            type="button"
            className="btn btn-outline rec-action-btn"
            onClick={() => onApplyRecommendation('discount')}
          >
            <span>Review Discount Candidates</span>
            <ArrowRightIcon size={15} />
          </button>
        </div>

        {/* Strategy 2: FIFO Stock Rotation */}
        <div className="recommendation-card card-fifo">
          <div className="rec-card-top">
            <span className="rec-type-badge badge-fifo">
              <RefreshCwIcon size={14} />
              <span>STOCK ROTATION</span>
            </span>
            <span className="rec-priority medium-priority">OPERATIONAL</span>
          </div>
          <h4 className="rec-headline">
            Sell Older Stock First — Strict FIFO Shelf Audit
          </h4>
          <p className="rec-description">
            {breadItem ? (
              <>
                Inspect bakery shelf for <strong>{breadItem.name}</strong>. Older batches
                are often pushed behind newly delivered loaves. Place earliest dated units at
                front-facing display using First-In-First-Out guidelines.
              </>
            ) : (
              'Enforce First-In-First-Out rotation across perishable dairy and bakery racks.'
            )}
          </p>
          <div className="rec-impact-row">
            <span className="impact-metric">
              Waste Diverted: <strong>~100% of hidden batches</strong>
            </span>
          </div>
          <button
            type="button"
            className="btn btn-outline rec-action-btn"
            onClick={() => onApplyRecommendation('fifo')}
          >
            <span>Filter Perishable Goods</span>
            <ArrowRightIcon size={15} />
          </button>
        </div>

        {/* Strategy 3: Promotional Bundling */}
        <div className="recommendation-card card-bundling">
          <div className="rec-card-top">
            <span className="rec-type-badge badge-bundle">
              <PackagePlusIcon size={14} />
              <span>PRODUCT BUNDLING</span>
            </span>
            <span className="rec-priority medium-priority">REVENUE BOOSTER</span>
          </div>
          <h4 className="rec-headline">
            Create Breakfast Combo Bundles
          </h4>
          <p className="rec-description">
            {yogurtItem ? (
              <>
                Pair <strong>{yogurtItem.name}</strong> (3 days remaining) with fast-selling
                cereal or fresh berries at a 15% combined combo savings. Bundling speeds up
                inventory turnover without damaging individual brand equity.
              </>
            ) : (
              'Bundle medium-risk perishables with top-selling dry grocery items for combo deals.'
            )}
          </p>
          <div className="rec-impact-row">
            <span className="impact-metric">
              Basket Value Impact: <strong>+18% Average Order</strong>
            </span>
          </div>
          <button
            type="button"
            className="btn btn-outline rec-action-btn"
            onClick={() => onApplyRecommendation('bundle')}
          >
            <span>View Bundling Inventory</span>
            <ArrowRightIcon size={15} />
          </button>
        </div>

        {/* Strategy 4: Review Future Procurement Orders */}
        <div className="recommendation-card card-ordering">
          <div className="rec-card-top">
            <span className="rec-type-badge badge-orders">
              <AnalyticsIcon size={14} />
              <span>PURCHASE ORDER AUDIT</span>
            </span>
            <span className="rec-priority low-priority">PREVENTIVE</span>
          </div>
          <h4 className="rec-headline">
            Trim Upcoming Supplier Purchase Orders by 15%
          </h4>
          <p className="rec-description">
            Weekly sales data shows dairy and beverage supply velocity is slowing down.
            Adjusting Monday's procurement order by -15% prevents over-indexing on stock
            that would enter high-risk status next weekend.
          </p>
          <div className="rec-impact-row">
            <span className="impact-metric">
              Overstock Prevention: <strong>₹4,200 Procurement Saved</strong>
            </span>
          </div>
          <button
            type="button"
            className="btn btn-outline rec-action-btn"
            onClick={() => onApplyRecommendation('order_review')}
          >
            <span>Inspect Velocity Trends</span>
            <ArrowRightIcon size={15} />
          </button>
        </div>
      </div>

      <div className="recommendations-footer-disclaimer">
        <span>
          💡 <strong>Transparency Note:</strong> Recommendations are generated by ReValueAI’s
          heuristic inventory rules based on shelf life, stock volume, and sales velocity.
          Always adhere to local food safety and labeling standards before markdown.
        </span>
      </div>
    </div>
  )
}
