import { MenuIcon, BellIcon, PlusIcon } from '../common/Icons'

export function Topbar({
  activeView,
  onOpenMobileMenu,
  onOpenAddModal,
  atRiskCount = 0,
  onNavigateToRisk,
}) {
  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-trigger"
          onClick={onOpenMobileMenu}
          aria-label="Open sidebar menu"
        >
          <MenuIcon size={22} />
        </button>

        <div className="breadcrumb-trail">
          <span className="crumb-root">ReValueAI</span>
          <span className="crumb-divider">/</span>
          <span className="crumb-current">{activeView}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Transparent Demo Badge as required */}
        <div className="demo-mode-tag" title="Frontend preview using simulated in-memory sample data">
          <span className="demo-status-pulse" />
          <span className="demo-tag-text">DEMO MODE · SAMPLE DATA</span>
        </div>

        {/* Expiry Risk Alerts Bell */}
        <button
          type="button"
          className="topbar-icon-button"
          onClick={onNavigateToRisk}
          title={`${atRiskCount} products requiring immediate attention`}
          aria-label="Expiry alerts"
        >
          <BellIcon size={19} />
          {atRiskCount > 0 && <span className="topbar-alert-dot" />}
        </button>

        {/* Primary Action Button */}
        <button
          type="button"
          className="btn btn-primary topbar-add-btn"
          onClick={onOpenAddModal}
        >
          <PlusIcon size={16} />
          <span>Add Product</span>
        </button>

        {/* User Avatar */}
        <div className="topbar-avatar" title="Team Lead Profile">
          TL
        </div>
      </div>
    </header>
  )
}
