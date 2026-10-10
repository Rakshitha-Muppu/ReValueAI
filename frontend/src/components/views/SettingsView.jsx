import { useState } from 'react'
import { SettingsIcon } from '../common/Icons'

export function SettingsView() {
  const [storeName, setStoreName] = useState('Green Basket Mart')
  const [outletId, setOutletId] = useState('BLR-IND-104')
  const [currency, setCurrency] = useState('INR')
  const [highRiskDays, setHighRiskDays] = useState('2')
  const [mediumRiskDays, setMediumRiskDays] = useState('5')
  const [autoDiscount, setAutoDiscount] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')

  function handleSave(e) {
    e.preventDefault()
    setSaveStatus('Preferences saved to demo session!')
    setTimeout(() => setSaveStatus(''), 4000)
  }

  return (
    <div className="settings-view-wrapper">
      <div className="panel settings-panel">
        <div className="panel-header">
          <div className="settings-header-lockup">
            <div className="settings-icon-badge">
              <SettingsIcon size={22} />
            </div>
            <div>
              <h3 className="panel-title">Store & Expiry Engine Settings</h3>
              <p className="panel-subtitle">
                Configure your retail branch parameters and risk alert sensitivity
              </p>
            </div>
          </div>
        </div>

        {saveStatus && (
          <div className="settings-alert-banner">
            <span>✅</span> {saveStatus}
          </div>
        )}

        <form onSubmit={handleSave} className="settings-form">
          <div className="settings-section">
            <h4 className="settings-subheading">Store Profile</h4>
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="store-name">
                  Store Display Name
                </label>
                <input
                  id="store-name"
                  type="text"
                  className="form-input"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="outlet-id">
                  Outlet / Branch Code
                </label>
                <input
                  id="outlet-id"
                  type="text"
                  className="form-input"
                  value={outletId}
                  onChange={(e) => setOutletId(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="currency-select">
                Operating Currency
              </label>
              <select
                id="currency-select"
                className="form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR">Indian Rupee (₹ - INR)</option>
                <option value="USD">US Dollar ($ - USD)</option>
                <option value="EUR">Euro (€ - EUR)</option>
                <option value="GBP">British Pound (£ - GBP)</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h4 className="settings-subheading">Expiry Risk Thresholds</h4>
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="high-days">
                  High Urgency Threshold (Days)
                </label>
                <input
                  id="high-days"
                  type="number"
                  min="1"
                  max="7"
                  className="form-input"
                  value={highRiskDays}
                  onChange={(e) => setHighRiskDays(e.target.value)}
                />
                <small className="form-help">
                  Products with fewer days and surplus stock will trigger High Risk alerts.
                </small>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="med-days">
                  Medium Urgency Threshold (Days)
                </label>
                <input
                  id="med-days"
                  type="number"
                  min="2"
                  max="14"
                  className="form-input"
                  value={mediumRiskDays}
                  onChange={(e) => setMediumRiskDays(e.target.value)}
                />
                <small className="form-help">
                  Products within this range trigger FIFO stock rotation recommendations.
                </small>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h4 className="settings-subheading">Automated Strategies</h4>
            <div className="checkbox-toggle-row">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={autoDiscount}
                  onChange={(e) => setAutoDiscount(e.target.checked)}
                />
                <span>Generate dynamic discount recommendations for products nearing 48h expiry</span>
              </label>
            </div>

            <div className="checkbox-toggle-row">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                />
                <span>Send daily morning digest of high-risk items to Store Manager</span>
              </label>
            </div>
          </div>

          {/* Backend Connection Information Card */}
          <div className="backend-info-card">
            <div className="backend-info-header">
              <span className="backend-pill">BACKEND COMPATIBILITY</span>
              <strong>MongoDB Atlas & Express Integration</strong>
            </div>
            <p>
              Your teammate's Express server in <code>backend/server.js</code> provides endpoints at{' '}
              <code>http://localhost:5000/api/products</code> connected to MongoDB Atlas.
              The frontend is fully pre-structured to consume this API whenever you are ready to connect!
            </p>
          </div>

          <div className="settings-actions">
            <button type="submit" className="btn btn-primary">
              Save Store Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
