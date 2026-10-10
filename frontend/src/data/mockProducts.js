// Helper to generate dates relative to today so demo data remains realistic
const getRelativeDate = (daysFromToday) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split('T')[0]
}

export const initialProducts = [
  {
    id: 'prod-001',
    name: 'Farm Fresh Organic Milk',
    category: 'Dairy',
    sku: 'DAI-101',
    quantity: 28,
    expiryDate: getRelativeDate(1), // Expiring tomorrow
    price: 36,
    averageDailySales: 8,
    unit: '1L pouch',
  },
  {
    id: 'prod-002',
    name: 'Artisan Whole Wheat Sourdough',
    category: 'Bakery',
    sku: 'BAK-204',
    quantity: 19,
    expiryDate: getRelativeDate(1), // Expiring tomorrow
    price: 65,
    averageDailySales: 5,
    unit: 'loaf (400g)',
  },
  {
    id: 'prod-003',
    name: 'Greek Natural Yogurt Tub',
    category: 'Dairy',
    sku: 'DAI-108',
    quantity: 34,
    expiryDate: getRelativeDate(3), // Expiring in 3 days
    price: 85,
    averageDailySales: 6,
    unit: '400g tub',
  },
  {
    id: 'prod-004',
    name: 'Farm Strawberries punnet',
    category: 'Produce',
    sku: 'PRO-302',
    quantity: 16,
    expiryDate: getRelativeDate(0), // Expiring today
    price: 110,
    averageDailySales: 3,
    unit: '250g box',
  },
  {
    id: 'prod-005',
    name: 'Freshly Squeezed Orange Juice',
    category: 'Beverages',
    sku: 'BEV-405',
    quantity: 42,
    expiryDate: getRelativeDate(6), // Expiring in 6 days
    price: 90,
    averageDailySales: 9,
    unit: '750ml bot',
  },
  {
    id: 'prod-006',
    name: 'Aged Cheddar Cheese Block',
    category: 'Dairy',
    sku: 'DAI-114',
    quantity: 22,
    expiryDate: getRelativeDate(5), // Expiring in 5 days
    price: 180,
    averageDailySales: 4,
    unit: '200g block',
  },
  {
    id: 'prod-007',
    name: 'Tender Baby Spinach Leaves',
    category: 'Produce',
    sku: 'PRO-309',
    quantity: 25,
    expiryDate: getRelativeDate(2), // Expiring in 2 days
    price: 45,
    averageDailySales: 7,
    unit: '200g pack',
  },
  {
    id: 'prod-008',
    name: 'Free-Range Chicken Breast Fillets',
    category: 'Meat & Poultry',
    sku: 'MEA-501',
    quantity: 14,
    expiryDate: getRelativeDate(2), // Expiring in 2 days
    price: 240,
    averageDailySales: 4,
    unit: '500g pack',
  },
  {
    id: 'prod-009',
    name: 'Almond Breeze Plant Drink',
    category: 'Beverages',
    sku: 'BEV-412',
    quantity: 38,
    expiryDate: getRelativeDate(18), // Expiring in 18 days
    price: 145,
    averageDailySales: 5,
    unit: '1L pack',
  },
  {
    id: 'prod-010',
    name: 'Multigrain Sandwich Bread',
    category: 'Bakery',
    sku: 'BAK-208',
    quantity: 20,
    expiryDate: getRelativeDate(2), // Expiring in 2 days
    price: 48,
    averageDailySales: 8,
    unit: 'loaf (450g)',
  },
  {
    id: 'prod-011',
    name: 'Sweet Alphonso Mango Pulp',
    category: 'Pantry',
    sku: 'PAN-602',
    quantity: 50,
    expiryDate: getRelativeDate(45), // Expiring in 45 days
    price: 160,
    averageDailySales: 6,
    unit: '850g tin',
  },
  {
    id: 'prod-012',
    name: 'Cultured Low-Fat Buttermilk',
    category: 'Dairy',
    sku: 'DAI-122',
    quantity: 32,
    expiryDate: getRelativeDate(2), // Expiring in 2 days
    price: 25,
    averageDailySales: 10,
    unit: '500ml pouch',
  },
]

export const CATEGORIES = [
  'All',
  'Dairy',
  'Bakery',
  'Produce',
  'Beverages',
  'Meat & Poultry',
  'Pantry',
]
