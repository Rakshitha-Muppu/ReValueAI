import { useMemo, useState } from 'react'
import { evaluateProductRisk, formatCurrency } from '../../utils/riskCalculator'
import { RiskBadge } from '../common/RiskBadge'
import { SearchIcon, CloseIcon, FilterIcon, ArrowRightIcon } from '../common/Icons'
import { CATEGORIES } from '../../data/mockProducts'

export function InventoryTable({
  products,
  searchQuery,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
  onSelectAction,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('expiry-asc') // 'expiry-asc', 'expiry-desc', 'price-desc', 'qty-desc', 'sales-desc'

  // Enrich each product with calculated risk and recommended action
  const enrichedProducts = useMemo(() => {
    return products.map((prod) => ({
      ...prod,
      riskAssessment: evaluateProductRisk(prod),
    }))
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return enrichedProducts
      .filter((p) => {
        // Search query
        const query = searchQuery.trim().toLowerCase()
        const matchesSearch =
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)

        // Category filter
        const matchesCat =
          selectedCategory === 'All' || p.category === selectedCategory

        // Risk filter
        let matchesRisk = true
        if (riskFilter === 'High') matchesRisk = p.riskAssessment.level === 'High'
        else if (riskFilter === 'Medium') matchesRisk = p.riskAssessment.level === 'Medium'
        else if (riskFilter === 'Low') matchesRisk = p.riskAssessment.level === 'Low'
        else if (riskFilter === 'AtRisk')
          matchesRisk = p.riskAssessment.level === 'High' || p.riskAssessment.level === 'Medium'

        return matchesSearch && matchesCat && matchesRisk
      })
      .sort((a, b) => {
        if (sortBy === 'expiry-asc') {
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        }
        if (sortBy === 'expiry-desc') {
          return new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
        }
        if (sortBy === 'qty-desc') {
          return Number(b.quantity) - Number(a.quantity)
        }
        if (sortBy === 'price-desc') {
          return Number(b.price) - Number(a.price)
        }
        if (sortBy === 'sales-desc') {
          return Number(b.averageDailySales) - Number(a.averageDailySales)
        }
        if (sortBy === 'risk-priority') {
          const rank = { High: 3, Medium: 2, Low: 1 }
          return rank[b.riskAssessment.level] - rank[a.riskAssessment.level]
        }
        return 0
      })
  }, [enrichedProducts, searchQuery, selectedCategory, riskFilter, sortBy])

  const hasActiveFilters =
    Boolean(searchQuery) || selectedCategory !== 'All' || riskFilter !== 'All'

  function handleResetFilters() {
    onSearchChange('')
    setSelectedCategory('All')
    onRiskFilterChange('All')
    setSortBy('expiry-asc')
  }

  // Visual category emoji helper
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Dairy':
        return '🥛'
      case 'Bakery':
        return '🍞'
      case 'Produce':
        return '🍓'
      case 'Beverages':
        return '🧃'
      case 'Meat & Poultry':
        return '🥩'
      case 'Pantry':
        return '🥫'
      default:
        return '📦'
    }
  }

  return (
    <div className="panel inventory-table-panel">
      {/* Table Header & Controls Bar */}
      <div className="table-controls-bar">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <SearchIcon size={17} className="search-icon" />
          <input
            type="text"
            className="table-search-input"
            placeholder="Search products by name, SKU or category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="filter-dropdowns-group">
          {/* Category Filter */}
          <div className="filter-select-wrapper">
            <span className="filter-label">Category:</span>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div className="filter-select-wrapper">
            <span className="filter-label">Risk Level:</span>
            <select
              className="filter-select"
              value={riskFilter}
              onChange={(e) => onRiskFilterChange(e.target.value)}
              aria-label="Filter by risk level"
            >
              <option value="All">All Risk Levels</option>
              <option value="AtRisk">⚠️ At-Risk Only (High & Med)</option>
              <option value="High">🔴 High Urgency (0–2 Days)</option>
              <option value="Medium">🟡 Medium Urgency (3–5 Days)</option>
              <option value="Low">🟢 Low / Healthy (6+ Days)</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="filter-select-wrapper">
            <span className="filter-label">Sort:</span>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
            >
              <option value="expiry-asc">Expiry Date (Soonest first)</option>
              <option value="expiry-desc">Expiry Date (Furthest first)</option>
              <option value="risk-priority">Urgency Priority (High → Low)</option>
              <option value="qty-desc">Quantity (Highest first)</option>
              <option value="price-desc">Price (Highest first)</option>
              <option value="sales-desc">Daily Sales (Highest first)</option>
            </select>
          </div>

          {/* Reset Filters CTA */}
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-ghost reset-filter-btn"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Responsive Table Scroll Container */}
      <div className="table-responsive-container">
        <table className="inventory-data-table">
          <thead>
            <tr>
              <th scope="col" className="col-product">PRODUCT NAME & SKU</th>
              <th scope="col" className="col-category">CATEGORY</th>
              <th scope="col" className="col-quantity">QUANTITY</th>
              <th scope="col" className="col-expiry">EXPIRY DATE</th>
              <th scope="col" className="col-price">PRICE</th>
              <th scope="col" className="col-sales">DAILY SALES</th>
              <th scope="col" className="col-risk">EXPIRY RISK</th>
              <th scope="col" className="col-action">RECOMMENDED ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const assessment = product.riskAssessment
              const formattedDate = new Date(`${product.expiryDate}T12:00:00`).toLocaleDateString(
                'en-IN',
                { day: 'numeric', month: 'short', year: 'numeric' }
              )

              return (
                <tr key={product.id} className={`row-risk-${assessment.level.toLowerCase()}`}>
                  {/* 1. Product Name */}
                  <td className="col-product">
                    <div className="product-identity-cell">
                      <div className="category-emoji-badge">
                        {getCategoryIcon(product.category)}
                      </div>
                      <div className="product-text">
                        <strong className="product-title">{product.name}</strong>
                        <span className="product-sku-code">
                          {product.sku} {product.unit ? `· ${product.unit}` : ''}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. Category */}
                  <td className="col-category">
                    <span className="category-tag">{product.category}</span>
                  </td>

                  {/* 3. Quantity */}
                  <td className="col-quantity">
                    <strong className="table-qty-number">{product.quantity}</strong>
                    <span className="table-unit-muted"> units</span>
                  </td>

                  {/* 4. Expiry Date */}
                  <td className="col-expiry">
                    <div className="expiry-date-cell">
                      <span>{formattedDate}</span>
                      <small className={`expiry-relative ${assessment.daysLeft <= 2 ? 'text-urgent' : ''}`}>
                        {assessment.daysLeft <= 0
                          ? 'Expires today'
                          : assessment.daysLeft === 1
                          ? '1 day remaining'
                          : `${assessment.daysLeft} days left`}
                      </small>
                    </div>
                  </td>

                  {/* 5. Price */}
                  <td className="col-price">
                    <strong className="table-price">{formatCurrency(product.price)}</strong>
                  </td>

                  {/* 6. Average Daily Sales */}
                  <td className="col-sales">
                    <span className="sales-rate">{product.averageDailySales}</span>
                    <span className="table-unit-muted"> /day</span>
                  </td>

                  {/* 7. Risk Level */}
                  <td className="col-risk">
                    <RiskBadge
                      level={assessment.level}
                      daysLeft={assessment.daysLeft}
                      showDays={false}
                    />
                  </td>

                  {/* 8. Recommended Action */}
                  <td className="col-action">
                    <div className="action-cell">
                      <span className={`action-badge action-${assessment.actionType}`}>
                        {assessment.action}
                      </span>
                      {onSelectAction && (
                        <button
                          type="button"
                          className="table-action-link"
                          onClick={() => onSelectAction(assessment.actionType, product)}
                          title="View detailed recommendation strategy"
                        >
                          <ArrowRightIcon size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="8" className="empty-table-cell">
                  <div className="empty-state-content">
                    <FilterIcon size={32} className="empty-icon" />
                    <h4>No products match your criteria</h4>
                    <p>Try loosening your search terms, category, or risk filters.</p>
                    <button
                      type="button"
                      className="btn btn-secondary empty-reset-btn"
                      onClick={handleResetFilters}
                    >
                      Clear All Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="table-footer-bar">
        <span className="table-showing-counter">
          Showing <strong>{filteredProducts.length}</strong> of{' '}
          <strong>{products.length}</strong> demo products
        </span>
        <span className="table-notice-footnote">
          ● Demo Data · Ready for MongoDB Atlas backend integration
        </span>
      </div>
    </div>
  )
}
