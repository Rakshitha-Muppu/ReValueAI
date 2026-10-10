import {
  DashboardIcon,
  InventoryIcon,
  RecommendationsIcon,
  AnalyticsIcon,
  SettingsIcon,
  LeafIcon,
  CloseIcon,
} from '../common/Icons'

const NAV_ITEMS = [
  { id: 'Dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'Inventory', label: 'Inventory', icon: InventoryIcon },
  { id: 'Recommendations', label: 'Recommendations', icon: RecommendationsIcon },
  { id: 'Analytics', label: 'Analytics', icon: AnalyticsIcon },
  { id: 'Settings', label: 'Settings', icon: SettingsIcon },
]

export function Sidebar({
  activeView,
  onSelectView,
  atRiskCount = 0,
  isOpen = false,
  onClose,
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-lockup">
            <div className="brand-logo-badge">
              <span>R</span>
              <span className="brand-logo-arrow">↗</span>
            </div>
            <div className="brand-meta">
              <span className="brand-title">
                Re:Value<span className="brand-ai-text"> AI</span>
              </span>
              <span className="brand-tagline">WASTE-REDUCTION OS</span>
            </div>
          </div>

          <button
            type="button"
            className="mobile-close-btn"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Store Profile Widget */}
        <div className="store-pill">
          <div className="store-avatar">GB</div>
          <div className="store-info">
            <span className="store-name">Green Basket Mart</span>
            <span className="store-location">Retail Outlet #104 · Demo</span>
          </div>
          <span className="store-status-dot" title="Store Operational" />
        </div>

        {/* Navigation Links */}
        <div className="nav-group-caption">WORKSPACE MODULES</div>
        <nav className="sidebar-nav" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            const showBadge =
              (item.id === 'Inventory' || item.id === 'Recommendations') &&
              atRiskCount > 0

            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onSelectView(item.id)
                  if (onClose) onClose()
                }}
              >
                <span className="nav-item-icon">
                  <Icon size={19} />
                </span>
                <span className="nav-item-label">{item.label}</span>
                {showBadge && (
                  <span
                    className={`nav-item-badge ${
                      item.id === 'Recommendations' ? 'badge-sparkle' : ''
                    }`}
                  >
                    {atRiskCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Eco / Sustainability Impact Card */}
        <div className="sidebar-eco-card">
          <div className="eco-header">
            <LeafIcon size={18} className="eco-leaf" />
            <span className="eco-title">Circular Retail Goal</span>
          </div>
          <p className="eco-copy">
            Proactive markdowns prevent 85% of near-expiry fresh goods from landfill disposal.
          </p>
          <div className="eco-meter-track">
            <div className="eco-meter-fill" style={{ width: '74%' }} />
          </div>
          <div className="eco-stats-row">
            <span>Preventable Waste Goal</span>
            <strong>74% On Track</strong>
          </div>
        </div>

        {/* User Workspace Info */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">TL</div>
            <div className="user-info">
              <span className="user-name">Store Inventory Lead</span>
              <span className="user-role">Operations & Supply</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
