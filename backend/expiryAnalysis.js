 function analyzeExpiry(product) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(product.expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const quantity = Number(product.quantity) || 0;
  const dailySales = Number(product.averageDailySales) || 0;

  const expectedSales =
    Math.max(0, daysUntilExpiry) * dailySales;

  const estimatedUnsold = Math.max(
    0,
    quantity - expectedSales
  );

  let riskLevel = "Low";

  if (daysUntilExpiry < 0) {
    riskLevel = "Expired";
  } else if (daysUntilExpiry === 0) {
    riskLevel = "High";
  } else if (expectedSales < quantity * 0.5) {
    riskLevel = "High";
  } else if (expectedSales < quantity) {
    riskLevel = "Medium";
  }

  let recommendation = "Monitor stock and sales.";

  if (riskLevel === "Expired") {
    recommendation =
      "Remove expired stock from sale and follow local food-safety procedures.";
  } else if (riskLevel === "High") {
    recommendation =
      "Prioritize this stock. Consider a suitable promotion or redistribution before expiry.";
  } else if (riskLevel === "Medium") {
    recommendation =
      "Monitor daily sales and consider a promotion if sales remain slow.";
  }

  return {
    ...product,
    daysUntilExpiry,
    expectedSales: Number(expectedSales.toFixed(2)),
    estimatedUnsold: Number(estimatedUnsold.toFixed(2)),
    estimatedRiskValue: Number(
      (estimatedUnsold * (Number(product.price) || 0)).toFixed(2)
    ),
    riskLevel,
    recommendation,
  };
}

module.exports = { analyzeExpiry };