import { useState, useMemo } from 'react'
import { initialProducts } from './data/mockProducts'
import { computeDashboardMetrics } from './utils/riskCalculator'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { SummaryCards } from './components/dashboard/SummaryCards'
import { RiskCharts } from './components/dashboard/RiskCharts'
import { RecommendationsSection } from './components/dashboard/RecommendationsSection'
import { InventoryTable } from './components/inventory/InventoryTable'
import { ProductFormModal } from './components/inventory/ProductFormModal'
import { AnalyticsView } from './components/views/AnalyticsView'
import { SettingsView } from './components/views/SettingsView'
import { PlusIcon, CloseIcon, LeafIcon } from './components/common/Icons'
import './App.css'

export function App() {
  const [products, setProducts] = useState(initialProducts)
  const [activeView, setActiveView] = useState('Dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('All')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Compute live KPI metrics across current inventory
  const metrics = useMemo(() => {
    return computeDashboardMetrics(products)
  }, [products])

  function showToast(message) {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 4500)
  }

  function handleAddProduct(newProduct) {
    setProducts((prev) => [newProduct, ...prev])
    showToast(`"${newProduct.name}" added to inventory demo session!`)
  }

  function handleFilterRisk(level) {
    setRiskFilter(level)
    setActiveView('Inventory')
    showToast(`Filtered inventory by ${level === 'AtRisk' ? 'At-Risk products' : `${level} Risk`}`)
  }

  function handleApplyRecommendation(actionType) {
    setActiveView('Inventory')
    if (actionType === 'discount') {
      setRiskFilter('High')
      showToast('Showing High Urgency products recommended for dynamic markdown.')
    } else if (actionType === 'fifo') {
      setRiskFilter('Medium')
      showToast('Showing products needing First-In-First-Out stock rotation.')
    } else if (actionType === 'bundle') {
      setRiskFilter('Medium')
      showToast('Showing candidates for promotional combo bundling.')
    } else if (actionType === 'order_review') {
      setRiskFilter('All')
      showToast('Showing full inventory catalog for procurement velocity audit.')
    }
  }

  function handleNavigateToRisk() {
    setRiskFilter('AtRisk')
    setActiveView('Inventory')
    showToast(`Showing ${metrics.atRiskProducts} products needing attention.`)
  }

  return (
    <div className="revalue-app-layout">
      {/* 1. Main Navigation Sidebar */}
      <Sidebar
        activeView={activeView}
        onSelectView={(view) => {
          setActiveView(view)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        atRiskCount={metrics.atRiskProducts}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Canvas */}
      <main className="app-main-canvas">
        {/* Top Header Bar */}
        <Topbar
          activeView={activeView}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          atRiskCount={metrics.atRiskProducts}
          onNavigateToRisk={handleNavigateToRisk}
        />

        {/* Global Feedback Toast Notification */}
        {toastMessage && (
          <aside className="global-toast-banner" role="status" aria-live="polite">
            <div className="toast-left">
              <span className="toast-sparkle">✦</span>
              <span className="toast-text">{toastMessage}</span>
            </div>
            <button
              type="button"
              className="toast-dismiss-btn"
              onClick={() => setToastMessage(null)}
              aria-label="Dismiss message"
            >
              <CloseIcon size={14} />
            </button>
          </aside>
        )}

        {/* Page Content Body */}
        <div className="content-container">
          {/* Welcome / Header Strip */}
          <section className="welcome-banner">
            <div className="welcome-text-col">
              <span className="welcome-date-badge">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <h1 className="welcome-headline">
                {activeView === 'Dashboard' && 'Store Waste & Expiry Overview'}
                {activeView === 'Inventory' && 'Inventory Ledger & Risk Tracking'}
                {activeView === 'Recommendations' && 'AI Action Strategies'}
                {activeView === 'Analytics' && 'Waste Prevention Reports'}
                {activeView === 'Settings' && 'Store Configuration'}
              </h1>
              <p className="welcome-subtitle">
                {activeView === 'Dashboard' &&
                  'Monitor perishables, avert spoilage with automated markdowns, and safeguard margins.'}
                {activeView === 'Inventory' &&
                  'Filter, sort, and inspect product expiration windows and sales velocities.'}
                {activeView === 'Recommendations' &&
                  'Targeted retail strategies: dynamic discounts, FIFO rotation, bundling, and procurement review.'}
                {activeView === 'Analytics' &&
                  'ESG metrics, landfill diversion progress, and avoided spoilage analytics.'}
                {activeView === 'Settings' &&
                  'Configure branch metadata, currency, and risk sensitivity thresholds.'}
              </p>
            </div>

            <div className="welcome-cta-col">
              <button
                type="button"
                className="btn btn-primary btn-add-hero"
                onClick={() => setIsAddModalOpen(true)}
              >
                <PlusIcon size={16} />
                <span>Add Product</span>
              </button>
            </div>
          </section>

          {/* VIEW: DASHBOARD */}
          {activeView === 'Dashboard' && (
            <div className="view-fade-in dashboard-view-content">
              {/* 4 Summary Cards */}
              <SummaryCards
                metrics={metrics}
                onFilterRisk={handleFilterRisk}
              />

              {/* Charts & Visual Summaries */}
              <RiskCharts
                metrics={metrics}
                onFilterRisk={handleFilterRisk}
              />

              {/* Actionable Recommendations */}
              <RecommendationsSection
                products={products}
                onApplyRecommendation={handleApplyRecommendation}
              />

              {/* Inventory Table Preview */}
              <section className="dashboard-inventory-section">
                <div className="section-title-bar">
                  <div>
                    <h3 className="section-title">Store Inventory Roster</h3>
                    <p className="section-subtitle">
                      Live catalog preview with risk classification and velocity tracking
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveView('Inventory')}
                  >
                    Open Full Inventory Ledger ↗
                  </button>
                </div>

                <InventoryTable
                  products={products}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  riskFilter={riskFilter}
                  onRiskFilterChange={setRiskFilter}
                  onSelectAction={handleApplyRecommendation}
                />
              </section>
            </div>
          )}

          {/* VIEW: INVENTORY */}
          {activeView === 'Inventory' && (
            <div className="view-fade-in inventory-view-content">
              {/* Quick Summary Pill Strip */}
              <div className="inventory-quick-stats">
                <div className="quick-stat-item">
                  <span>Total Items:</span>
                  <strong>{metrics.totalProducts}</strong>
                </div>
                <div className="quick-stat-item">
                  <span>At-Risk:</span>
                  <strong className="text-amber">{metrics.atRiskProducts}</strong>
                </div>
                <div className="quick-stat-item">
                  <span>High Urgency:</span>
                  <strong className="text-rose">{metrics.highRiskCount}</strong>
                </div>
                <div className="quick-stat-item">
                  <span>Value at Risk:</span>
                  <strong className="text-rose">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(metrics.estimatedValueAtRisk)}
                  </strong>
                </div>
              </div>

              <InventoryTable
                products={products}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                riskFilter={riskFilter}
                onRiskFilterChange={setRiskFilter}
                onSelectAction={handleApplyRecommendation}
              />
            </div>
          )}

          {/* VIEW: RECOMMENDATIONS */}
          {activeView === 'Recommendations' && (
            <div className="view-fade-in recommendations-view-content">
              <RecommendationsSection
                products={products}
                onApplyRecommendation={handleApplyRecommendation}
              />

              <div className="rec-table-wrapper" style={{ marginTop: '24px' }}>
                <h3 className="section-title">Products Requiring Immediate Action</h3>
                <p className="section-subtitle">
                  Inventory items with less than 5 days remaining or velocity deficits
                </p>
                <InventoryTable
                  products={products}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  riskFilter="AtRisk"
                  onRiskFilterChange={setRiskFilter}
                  onSelectAction={handleApplyRecommendation}
                />
              </div>
            </div>
          )}

          {/* VIEW: ANALYTICS */}
          {activeView === 'Analytics' && (
            <div className="view-fade-in analytics-view-content">
              <AnalyticsView products={products} />
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeView === 'Settings' && (
            <div className="view-fade-in settings-view-content">
              <SettingsView />
            </div>
          )}

          {/* Site Footer */}
          <footer className="app-footer">
            <div className="footer-left">
              <span className="footer-brand">Re:Value AI</span>
              <span className="footer-bullet">•</span>
              <span className="footer-tagline">
                Retail product-expiry risk and waste-reduction platform
              </span>
            </div>
            <div className="footer-right">
              <LeafIcon size={14} className="footer-leaf" />
              <span>Simulated Demo Mode · Designed for Zero Avoidable Waste</span>
            </div>
          </footer>
        </div>
      </main>

      {/* 3. Add Product Modal */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  )
}

export default App
