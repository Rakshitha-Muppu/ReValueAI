/**
 * Calculates days remaining until the product expiry date.
 */
export function getDaysRemaining(expiryDateStr) {
  if (!expiryDateStr) return 0
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const expiry = new Date(expiryDateStr)
  expiry.setHours(0, 0, 0, 0)

  const diffTime = expiry.getTime() - now.getTime()
  return Math.round(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Evaluates expiry risk based on days remaining and average sales velocity.
 * Returns: { level: 'High' | 'Medium' | 'Low', daysLeft, surplusQty, action, badgeClass }
 */
export function evaluateProductRisk(product) {
  const daysLeft = getDaysRemaining(product.expiryDate)
  const quantity = Number(product.quantity) || 0
  const sales = Number(product.averageDailySales) || 0
  const price = Number(product.price) || 0

  const projectedDemand = Math.max(0, daysLeft) * sales
  const surplusQty = Math.max(0, quantity - projectedDemand)
  const surplusValue = surplusQty * price

  let level = 'Low'
  let action = 'Monitor sell-through rate'
  let actionType = 'monitor'

  if (daysLeft <= 1) {
    level = 'High'
    action = 'Apply 40%-50% flash discount today'
    actionType = 'discount'
  } else if (daysLeft <= 3) {
    if (surplusQty > 0) {
      level = 'High'
      action = 'Apply 25%-30% markdown to clear surplus'
      actionType = 'discount'
    } else {
      level = 'Medium'
      action = 'Sell older stock first (strict FIFO rotation)'
      actionType = 'fifo'
    }
  } else if (daysLeft <= 6) {
    if (surplusQty > 0) {
      level = 'Medium'
      action = 'Bundle with high-turnover grocery items'
      actionType = 'bundle'
    } else {
      level = 'Low'
      action = 'Inspect stock & rotate newer arrivals behind'
      actionType = 'fifo'
    }
  } else {
    level = 'Low'
    if (quantity > sales * 14) {
      action = 'Review future orders — stock velocity is low'
      actionType = 'order_review'
    } else {
      action = 'Adequate shelf life — standard merchandising'
      actionType = 'monitor'
    }
  }

  return {
    level,
    daysLeft,
    surplusQty,
    surplusValue,
    action,
    actionType,
  }
}

/**
 * Format numbers into INR Currency (₹)
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

/**
 * Compute aggregate summary metrics for the store dashboard.
 */
export function computeDashboardMetrics(products) {
  let totalProducts = products.length
  let highRiskCount = 0
  let mediumRiskCount = 0
  let lowRiskCount = 0

  let totalInventoryValue = 0
  let estimatedValueAtRisk = 0

  products.forEach((product) => {
    const qty = Number(product.quantity) || 0
    const price = Number(product.price) || 0
    const value = qty * price
    totalInventoryValue += value

    const risk = evaluateProductRisk(product)
    if (risk.level === 'High') {
      highRiskCount += 1
      estimatedValueAtRisk += value
    } else if (risk.level === 'Medium') {
      mediumRiskCount += 1
      estimatedValueAtRisk += risk.surplusValue > 0 ? risk.surplusValue : value * 0.4
    } else {
      lowRiskCount += 1
    }
  })

  const atRiskProducts = highRiskCount + mediumRiskCount

  // Potential waste reduction: estimating ~65% value recovery through proactive discounting and FIFO
  const potentialWasteReductionValue = Math.round(estimatedValueAtRisk * 0.68)
  const wasteReductionPercent = totalInventoryValue > 0
    ? Math.min(96, Math.max(12, Math.round((potentialWasteReductionValue / (estimatedValueAtRisk || 1)) * 100)))
    : 0

  return {
    totalProducts,
    atRiskProducts,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    totalInventoryValue,
    estimatedValueAtRisk,
    potentialWasteReductionValue,
    wasteReductionPercent,
  }
}
