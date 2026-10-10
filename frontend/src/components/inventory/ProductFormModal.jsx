import { useState, useMemo } from 'react'
import { CloseIcon, PlusIcon } from '../common/Icons'
import { evaluateProductRisk } from '../../utils/riskCalculator'
import { RiskBadge } from '../common/RiskBadge'

export function ProductFormModal({ isOpen, onClose, onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dairy',
    quantity: '',
    expiryDate: '',
    price: '',
    averageDailySales: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Compute live real-time risk preview
  const liveRiskPreview = useMemo(() => {
    if (!formData.expiryDate || !formData.quantity) return null
    return evaluateProductRisk({
      expiryDate: formData.expiryDate,
      quantity: Number(formData.quantity) || 0,
      averageDailySales: Number(formData.averageDailySales) || 0,
      price: Number(formData.price) || 0,
    })
  }, [formData])

  if (!isOpen) return null

  function validate() {
    const errs = {}

    // Name validation
    if (!formData.name.trim()) {
      errs.name = 'Product name is required.'
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.'
    }

    // Quantity validation
    const qty = Number(formData.quantity)
    if (formData.quantity === '' || isNaN(qty)) {
      errs.quantity = 'Stock quantity is required.'
    } else if (qty <= 0) {
      errs.quantity = 'Quantity must be a positive integer.'
    }

    // Expiry Date validation
    if (!formData.expiryDate) {
      errs.expiryDate = 'Expiry date is required.'
    } else {
      const parsedDate = new Date(`${formData.expiryDate}T00:00:00`)
      if (isNaN(parsedDate.getTime())) {
        errs.expiryDate = 'Please select a valid calendar date.'
      }
    }

    // Price validation
    const price = Number(formData.price)
    if (formData.price === '' || isNaN(price)) {
      errs.price = 'Price is required.'
    } else if (price < 0) {
      errs.price = 'Price cannot be negative.'
    }

    // Daily Sales validation
    const sales = Number(formData.averageDailySales)
    if (formData.averageDailySales === '' || isNaN(sales)) {
      errs.averageDailySales = 'Average daily sales velocity is required.'
    } else if (sales < 0) {
      errs.averageDailySales = 'Daily sales cannot be negative.'
    }

    return errs
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validate())
  }

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    setTouched({
      name: true,
      category: true,
      quantity: true,
      expiryDate: true,
      price: true,
      averageDailySales: true,
    })

    if (Object.keys(validationErrors).length > 0) return

    // Create normalized product
    const categoryPrefix = formData.category.slice(0, 3).toUpperCase()
    const randomSuffix = Math.floor(100 + Math.random() * 900)
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      sku: `${categoryPrefix}-${randomSuffix}`,
      quantity: Number(formData.quantity),
      expiryDate: formData.expiryDate,
      price: Number(formData.price),
      averageDailySales: Number(formData.averageDailySales),
      unit: 'standard pack',
    }

    onAddProduct(newProduct)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="modal-header">
          <div>
            <span className="modal-badge">INVENTORY MANAGEMENT</span>
            <h3 id="modal-headline" className="modal-title">
              Add New Retail Product
            </h3>
            <p className="modal-subtitle">
              Enter stock and velocity details to assess expiry risk.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          {/* Row 1: Product Name */}
          <div className="form-group">
            <label htmlFor="prod-name" className="form-label">
              Product Name <span className="text-required">*</span>
            </label>
            <input
              id="prod-name"
              type="text"
              className={`form-input ${touched.name && errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Organic Cow Milk 1L or Brown Bread"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              required
            />
            {touched.name && errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          {/* Row 2: Category & Quantity */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="prod-cat" className="form-label">
                Category <span className="text-required">*</span>
              </label>
              <select
                id="prod-cat"
                className="form-select"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <option value="Dairy">Dairy</option>
                <option value="Bakery">Bakery</option>
                <option value="Produce">Produce</option>
                <option value="Beverages">Beverages</option>
                <option value="Meat & Poultry">Meat & Poultry</option>
                <option value="Pantry">Pantry</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prod-qty" className="form-label">
                Quantity (Units) <span className="text-required">*</span>
              </label>
              <input
                id="prod-qty"
                type="number"
                min="1"
                step="1"
                className={`form-input ${touched.quantity && errors.quantity ? 'input-error' : ''}`}
                placeholder="e.g. 25"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                onBlur={() => handleBlur('quantity')}
                required
              />
              {touched.quantity && errors.quantity && (
                <span className="error-message">{errors.quantity}</span>
              )}
            </div>
          </div>

          {/* Row 3: Price & Expiry Date */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="prod-price" className="form-label">
                Price per Unit (₹) <span className="text-required">*</span>
              </label>
              <input
                id="prod-price"
                type="number"
                min="0"
                step="0.5"
                className={`form-input ${touched.price && errors.price ? 'input-error' : ''}`}
                placeholder="e.g. 45"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                onBlur={() => handleBlur('price')}
                required
              />
              {touched.price && errors.price && (
                <span className="error-message">{errors.price}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="prod-expiry" className="form-label">
                Expiry Date <span className="text-required">*</span>
              </label>
              <input
                id="prod-expiry"
                type="date"
                className={`form-input ${touched.expiryDate && errors.expiryDate ? 'input-error' : ''}`}
                value={formData.expiryDate}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
                onBlur={() => handleBlur('expiryDate')}
                required
              />
              {touched.expiryDate && errors.expiryDate && (
                <span className="error-message">{errors.expiryDate}</span>
              )}
            </div>
          </div>

          {/* Row 4: Average Daily Sales */}
          <div className="form-group">
            <label htmlFor="prod-sales" className="form-label">
              Average Daily Sales (Units/Day) <span className="text-required">*</span>
            </label>
            <input
              id="prod-sales"
              type="number"
              min="0"
              step="1"
              className={`form-input ${touched.averageDailySales && errors.averageDailySales ? 'input-error' : ''}`}
              placeholder="e.g. 6 (used to forecast expiry surplus)"
              value={formData.averageDailySales}
              onChange={(e) => handleChange('averageDailySales', e.target.value)}
              onBlur={() => handleBlur('averageDailySales')}
              required
            />
            {touched.averageDailySales && errors.averageDailySales && (
              <span className="error-message">{errors.averageDailySales}</span>
            )}
          </div>

          {/* Real-time Risk Assessment Preview */}
          {liveRiskPreview && (
            <div className="form-live-assessment">
              <div className="assessment-header">
                <span>Calculated Risk Assessment:</span>
                <RiskBadge
                  level={liveRiskPreview.level}
                  daysLeft={liveRiskPreview.daysLeft}
                  showDays={true}
                />
              </div>
              <p className="assessment-recommendation">
                <strong>Recommended strategy:</strong> {liveRiskPreview.action}
              </p>
            </div>
          )}

          {/* Integration disclaimer */}
          <div className="form-demo-disclaimer">
            <span className="disclaimer-icon">ℹ️</span>
            <span>
              <strong>Demo Session Note:</strong> This product will be added to your local
              session. Once your backend with MongoDB Atlas is connected, products will
              be persisted directly via <code>POST /api/products</code>.
            </span>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions-bar">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <PlusIcon size={16} />
              <span>Add to Inventory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
