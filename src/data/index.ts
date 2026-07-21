export const REGIONS = [
  "Jaipur", "Delhi", "Mumbai", "Bengaluru", "Pune",
  "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Chandigarh",
] as const;

export const CATEGORIES = [
  "Electronics", "Furniture", "Clothing", "Grocery", "Office Supplies",
] as const;

export const SEGMENTS = ["Consumer", "Corporate", "Home Office"] as const;

export type Region = (typeof REGIONS)[number];
export type Category = (typeof CATEGORIES)[number];
export type Segment = (typeof SEGMENTS)[number];

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export interface MonthlySales {
  month: string;
  revenue: number;
  profit: number;
  orders: number;
}
export const monthlySales: MonthlySales[] = [
  { month: "Jan", revenue: 1650000, profit: 305000, orders: 820 },
  { month: "Feb", revenue: 1720000, profit: 320000, orders: 860 },
  { month: "Mar", revenue: 1880000, profit: 348000, orders: 940 },
  { month: "Apr", revenue: 1950000, profit: 361000, orders: 970 },
  { month: "May", revenue: 2100000, profit: 388000, orders: 1050 },
  { month: "Jun", revenue: 2050000, profit: 379000, orders: 1030 },
  { month: "Jul", revenue: 2180000, profit: 403000, orders: 1090 },
  { month: "Aug", revenue: 2240000, profit: 414000, orders: 1120 },
  { month: "Sep", revenue: 2150000, profit: 397000, orders: 1080 },
  { month: "Oct", revenue: 2320000, profit: 429000, orders: 1160 },
  { month: "Nov", revenue: 2400000, profit: 444000, orders: 1200 },
  { month: "Dec", revenue: 2160000, profit: 412000, orders: 1130 },
];

export interface Product {
  id: string;
  name: string;
  category: Category;
  subcategory: string;
  unitsSold: number;
  revenue: number;
  profit: number;
  stock: number;
  reorderLevel: number;
  price: number;
}
export const products: Product[] = [
  { id: "P001", name: "Wireless Headphones", category: "Electronics", subcategory: "Audio", unitsSold: 1240, revenue: 620000, profit: 148000, stock: 320, reorderLevel: 100, price: 4999 },
  { id: "P002", name: "Smart LED TV 43\"", category: "Electronics", subcategory: "Television", unitsSold: 420, revenue: 1260000, profit: 214000, stock: 45, reorderLevel: 60, price: 29999 },
  { id: "P003", name: "Laptop 14\" i5", category: "Electronics", subcategory: "Computers", unitsSold: 310, revenue: 1550000, profit: 232000, stock: 80, reorderLevel: 40, price: 49999 },
  { id: "P004", name: "Bluetooth Speaker", category: "Electronics", subcategory: "Audio", unitsSold: 980, revenue: 294000, profit: 76000, stock: 210, reorderLevel: 80, price: 2999 },
  { id: "P005", name: "Ergonomic Chair", category: "Furniture", subcategory: "Seating", unitsSold: 260, revenue: 780000, profit: 195000, stock: 55, reorderLevel: 50, price: 8999 },
  { id: "P006", name: "Study Desk", category: "Furniture", subcategory: "Tables", unitsSold: 340, revenue: 680000, profit: 156000, stock: 12, reorderLevel: 40, price: 5999 },
  { id: "P007", name: "Bookshelf", category: "Furniture", subcategory: "Storage", unitsSold: 180, revenue: 360000, profit: 82000, stock: 0, reorderLevel: 25, price: 3999 },
  { id: "P008", name: "Sofa 3-Seater", category: "Furniture", subcategory: "Seating", unitsSold: 90, revenue: 810000, profit: 178000, stock: 22, reorderLevel: 20, price: 24999 },
  { id: "P009", name: "Men's T-Shirt", category: "Clothing", subcategory: "Tops", unitsSold: 2100, revenue: 630000, profit: 189000, stock: 850, reorderLevel: 300, price: 799 },
  { id: "P010", name: "Women's Kurta", category: "Clothing", subcategory: "Ethnic", unitsSold: 1650, revenue: 825000, profit: 231000, stock: 620, reorderLevel: 250, price: 1299 },
  { id: "P011", name: "Denim Jeans", category: "Clothing", subcategory: "Bottoms", unitsSold: 1420, revenue: 852000, profit: 213000, stock: 8, reorderLevel: 200, price: 1499 },
  { id: "P012", name: "Running Shoes", category: "Clothing", subcategory: "Footwear", unitsSold: 780, revenue: 1170000, profit: 292000, stock: 140, reorderLevel: 100, price: 2999 },
  { id: "P013", name: "Basmati Rice 5kg", category: "Grocery", subcategory: "Staples", unitsSold: 3200, revenue: 640000, profit: 96000, stock: 1200, reorderLevel: 500, price: 549 },
  { id: "P014", name: "Cooking Oil 5L", category: "Grocery", subcategory: "Staples", unitsSold: 2800, revenue: 700000, profit: 84000, stock: 4, reorderLevel: 400, price: 899 },
  { id: "P015", name: "Whole Wheat Atta 10kg", category: "Grocery", subcategory: "Staples", unitsSold: 2500, revenue: 500000, profit: 75000, stock: 900, reorderLevel: 500, price: 449 },
  { id: "P016", name: "Green Tea Pack", category: "Grocery", subcategory: "Beverages", unitsSold: 1400, revenue: 210000, profit: 42000, stock: 320, reorderLevel: 200, price: 299 },
  { id: "P017", name: "A4 Printer Paper", category: "Office Supplies", subcategory: "Stationery", unitsSold: 1900, revenue: 285000, profit: 57000, stock: 780, reorderLevel: 300, price: 399 },
  { id: "P018", name: "Ballpoint Pen Pack", category: "Office Supplies", subcategory: "Stationery", unitsSold: 4200, revenue: 210000, profit: 63000, stock: 0, reorderLevel: 500, price: 99 },
  { id: "P019", name: "Desk Organizer", category: "Office Supplies", subcategory: "Accessories", unitsSold: 640, revenue: 192000, profit: 48000, stock: 95, reorderLevel: 80, price: 699 },
  { id: "P020", name: "Whiteboard 4x3ft", category: "Office Supplies", subcategory: "Accessories", unitsSold: 210, revenue: 315000, profit: 78000, stock: 6, reorderLevel: 25, price: 2499 },
];

export interface Customer {
  id: string;
  name: string;
  email: string;
  region: Region;
  segment: Segment;
  totalOrders: number;
  totalSpent: number;
  lifetimeValue: number;
  joinedYear: number;
  status: "New" | "Returning" | "VIP";
}
export const customers: Customer[] = [
  { id: "C001", name: "Aarav Sharma", email: "aarav@example.com", region: "Delhi", segment: "Consumer", totalOrders: 12, totalSpent: 85400, lifetimeValue: 128000, joinedYear: 2022, status: "Returning" },
  { id: "C002", name: "Priya Patel", email: "priya@example.com", region: "Mumbai", segment: "Corporate", totalOrders: 24, totalSpent: 245000, lifetimeValue: 380000, joinedYear: 2021, status: "VIP" },
  { id: "C003", name: "Rohan Iyer", email: "rohan@example.com", region: "Bengaluru", segment: "Home Office", totalOrders: 8, totalSpent: 62000, lifetimeValue: 92000, joinedYear: 2023, status: "Returning" },
  { id: "C004", name: "Kavya Reddy", email: "kavya@example.com", region: "Hyderabad", segment: "Consumer", totalOrders: 3, totalSpent: 18200, lifetimeValue: 22000, joinedYear: 2026, status: "New" },
  { id: "C005", name: "Ananya Singh", email: "ananya@example.com", region: "Jaipur", segment: "Consumer", totalOrders: 15, totalSpent: 112000, lifetimeValue: 168000, joinedYear: 2022, status: "Returning" },
  { id: "C006", name: "Vikram Rao", email: "vikram@example.com", region: "Pune", segment: "Corporate", totalOrders: 31, totalSpent: 412000, lifetimeValue: 520000, joinedYear: 2020, status: "VIP" },
  { id: "C007", name: "Meera Nair", email: "meera@example.com", region: "Chennai", segment: "Home Office", totalOrders: 6, totalSpent: 48000, lifetimeValue: 70000, joinedYear: 2024, status: "Returning" },
  { id: "C008", name: "Arjun Gupta", email: "arjun@example.com", region: "Kolkata", segment: "Consumer", totalOrders: 2, totalSpent: 9800, lifetimeValue: 12000, joinedYear: 2026, status: "New" },
  { id: "C009", name: "Sneha Joshi", email: "sneha@example.com", region: "Ahmedabad", segment: "Consumer", totalOrders: 18, totalSpent: 134000, lifetimeValue: 195000, joinedYear: 2021, status: "Returning" },
  { id: "C010", name: "Rahul Verma", email: "rahul@example.com", region: "Chandigarh", segment: "Corporate", totalOrders: 27, totalSpent: 318000, lifetimeValue: 430000, joinedYear: 2020, status: "VIP" },
  { id: "C011", name: "Divya Menon", email: "divya@example.com", region: "Delhi", segment: "Home Office", totalOrders: 9, totalSpent: 71000, lifetimeValue: 98000, joinedYear: 2023, status: "Returning" },
  { id: "C012", name: "Karthik Nair", email: "karthik@example.com", region: "Mumbai", segment: "Consumer", totalOrders: 4, totalSpent: 22000, lifetimeValue: 28000, joinedYear: 2025, status: "New" },
  { id: "C013", name: "Pooja Desai", email: "pooja@example.com", region: "Bengaluru", segment: "Corporate", totalOrders: 21, totalSpent: 268000, lifetimeValue: 360000, joinedYear: 2021, status: "VIP" },
  { id: "C014", name: "Nikhil Bhatia", email: "nikhil@example.com", region: "Hyderabad", segment: "Consumer", totalOrders: 11, totalSpent: 82000, lifetimeValue: 118000, joinedYear: 2023, status: "Returning" },
  { id: "C015", name: "Shreya Kapoor", email: "shreya@example.com", region: "Jaipur", segment: "Home Office", totalOrders: 5, totalSpent: 34000, lifetimeValue: 46000, joinedYear: 2024, status: "New" },
];

export interface Order {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  category: Category;
  region: Region;
  segment: Segment;
  quantity: number;
  revenue: number;
  profit: number;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
}
export const orders: Order[] = [
  { id: "O10001", date: "2026-07-01", customerId: "C002", customerName: "Priya Patel", productId: "P003", productName: "Laptop 14\" i5", category: "Electronics", region: "Mumbai", segment: "Corporate", quantity: 2, revenue: 99998, profit: 15000, status: "Delivered" },
  { id: "O10002", date: "2026-07-02", customerId: "C005", customerName: "Ananya Singh", productId: "P010", productName: "Women's Kurta", category: "Clothing", region: "Jaipur", segment: "Consumer", quantity: 3, revenue: 3897, profit: 1100, status: "Delivered" },
  { id: "O10003", date: "2026-07-03", customerId: "C006", customerName: "Vikram Rao", productId: "P005", productName: "Ergonomic Chair", category: "Furniture", region: "Pune", segment: "Corporate", quantity: 4, revenue: 35996, profit: 8800, status: "Delivered" },
  { id: "O10004", date: "2026-07-04", customerId: "C001", customerName: "Aarav Sharma", productId: "P001", productName: "Wireless Headphones", category: "Electronics", region: "Delhi", segment: "Consumer", quantity: 1, revenue: 4999, profit: 1200, status: "Shipped" },
  { id: "O10005", date: "2026-07-05", customerId: "C013", customerName: "Pooja Desai", productId: "P002", productName: "Smart LED TV 43\"", category: "Electronics", region: "Bengaluru", segment: "Corporate", quantity: 1, revenue: 29999, profit: 5200, status: "Delivered" },
  { id: "O10006", date: "2026-07-06", customerId: "C009", customerName: "Sneha Joshi", productId: "P013", productName: "Basmati Rice 5kg", category: "Grocery", region: "Ahmedabad", segment: "Consumer", quantity: 6, revenue: 3294, profit: 480, status: "Delivered" },
  { id: "O10007", date: "2026-07-07", customerId: "C010", customerName: "Rahul Verma", productId: "P017", productName: "A4 Printer Paper", category: "Office Supplies", region: "Chandigarh", segment: "Corporate", quantity: 20, revenue: 7980, profit: 1600, status: "Delivered" },
  { id: "O10008", date: "2026-07-08", customerId: "C003", customerName: "Rohan Iyer", productId: "P012", productName: "Running Shoes", category: "Clothing", region: "Bengaluru", segment: "Home Office", quantity: 1, revenue: 2999, profit: 750, status: "Processing" },
  { id: "O10009", date: "2026-07-09", customerId: "C007", customerName: "Meera Nair", productId: "P019", productName: "Desk Organizer", category: "Office Supplies", region: "Chennai", segment: "Home Office", quantity: 2, revenue: 1398, profit: 350, status: "Delivered" },
  { id: "O10010", date: "2026-07-10", customerId: "C011", customerName: "Divya Menon", productId: "P006", productName: "Study Desk", category: "Furniture", region: "Delhi", segment: "Home Office", quantity: 1, revenue: 5999, profit: 1400, status: "Shipped" },
  { id: "O10011", date: "2026-07-11", customerId: "C014", customerName: "Nikhil Bhatia", productId: "P004", productName: "Bluetooth Speaker", category: "Electronics", region: "Hyderabad", segment: "Consumer", quantity: 2, revenue: 5998, profit: 1500, status: "Delivered" },
  { id: "O10012", date: "2026-07-12", customerId: "C015", customerName: "Shreya Kapoor", productId: "P009", productName: "Men's T-Shirt", category: "Clothing", region: "Jaipur", segment: "Home Office", quantity: 4, revenue: 3196, profit: 950, status: "Delivered" },
  { id: "O10013", date: "2026-07-13", customerId: "C008", customerName: "Arjun Gupta", productId: "P015", productName: "Whole Wheat Atta 10kg", category: "Grocery", region: "Kolkata", segment: "Consumer", quantity: 2, revenue: 898, profit: 130, status: "Cancelled" },
  { id: "O10014", date: "2026-07-14", customerId: "C002", customerName: "Priya Patel", productId: "P008", productName: "Sofa 3-Seater", category: "Furniture", region: "Mumbai", segment: "Corporate", quantity: 1, revenue: 24999, profit: 5500, status: "Delivered" },
  { id: "O10015", date: "2026-07-15", customerId: "C006", customerName: "Vikram Rao", productId: "P020", productName: "Whiteboard 4x3ft", category: "Office Supplies", region: "Pune", segment: "Corporate", quantity: 2, revenue: 4998, profit: 1240, status: "Delivered" },
  { id: "O10016", date: "2026-07-16", customerId: "C004", customerName: "Kavya Reddy", productId: "P016", productName: "Green Tea Pack", category: "Grocery", region: "Hyderabad", segment: "Consumer", quantity: 3, revenue: 897, profit: 180, status: "Delivered" },
  { id: "O10017", date: "2026-07-17", customerId: "C012", customerName: "Karthik Nair", productId: "P011", productName: "Denim Jeans", category: "Clothing", region: "Mumbai", segment: "Consumer", quantity: 2, revenue: 2998, profit: 750, status: "Shipped" },
  { id: "O10018", date: "2026-07-18", customerId: "C010", customerName: "Rahul Verma", productId: "P003", productName: "Laptop 14\" i5", category: "Electronics", region: "Chandigarh", segment: "Corporate", quantity: 3, revenue: 149997, profit: 22500, status: "Processing" },
  { id: "O10019", date: "2026-07-19", customerId: "C013", customerName: "Pooja Desai", productId: "P005", productName: "Ergonomic Chair", category: "Furniture", region: "Bengaluru", segment: "Corporate", quantity: 2, revenue: 17998, profit: 4400, status: "Delivered" },
  { id: "O10020", date: "2026-07-20", customerId: "C009", customerName: "Sneha Joshi", productId: "P010", productName: "Women's Kurta", category: "Clothing", region: "Ahmedabad", segment: "Consumer", quantity: 2, revenue: 2598, profit: 730, status: "Delivered" },
];

export interface PipelineRun {
  id: string;
  startedAt: string;
  durationSec: number;
  bronzeRecords: number;
  silverRecords: number;
  goldDatasets: number;
  status: "Success" | "Failed" | "Partial";
  triggeredBy: string;
}
export const pipelineRuns: PipelineRun[] = [
  { id: "RUN-1024", startedAt: "2026-07-20 08:00", durationSec: 142, bronzeRecords: 15000, silverRecords: 14620, goldDatasets: 8, status: "Success", triggeredBy: "scheduler" },
  { id: "RUN-1023", startedAt: "2026-07-19 08:00", durationSec: 138, bronzeRecords: 14820, silverRecords: 14455, goldDatasets: 8, status: "Success", triggeredBy: "scheduler" },
  { id: "RUN-1022", startedAt: "2026-07-18 08:00", durationSec: 151, bronzeRecords: 15220, silverRecords: 14801, goldDatasets: 8, status: "Success", triggeredBy: "scheduler" },
  { id: "RUN-1021", startedAt: "2026-07-17 08:00", durationSec: 205, bronzeRecords: 14980, silverRecords: 14200, goldDatasets: 7, status: "Partial", triggeredBy: "manual" },
  { id: "RUN-1020", startedAt: "2026-07-16 08:00", durationSec: 133, bronzeRecords: 14780, silverRecords: 14420, goldDatasets: 8, status: "Success", triggeredBy: "scheduler" },
  { id: "RUN-1019", startedAt: "2026-07-15 08:00", durationSec: 128, bronzeRecords: 14650, silverRecords: 14310, goldDatasets: 8, status: "Success", triggeredBy: "scheduler" },
  { id: "RUN-1018", startedAt: "2026-07-14 08:00", durationSec: 310, bronzeRecords: 14900, silverRecords: 0, goldDatasets: 0, status: "Failed", triggeredBy: "scheduler" },
  { id: "RUN-1017", startedAt: "2026-07-13 08:00", durationSec: 145, bronzeRecords: 15100, silverRecords: 14730, goldDatasets: 8, status: "Success", triggeredBy: "scheduler" },
];

export interface QualityRule {
  id: string;
  name: string;
  layer: "Bronze" | "Silver" | "Gold";
  dimension: "Completeness" | "Uniqueness" | "Validity" | "Consistency";
  passed: number;
  failed: number;
  status: "Pass" | "Warn" | "Fail";
}
export const qualityRules: QualityRule[] = [
  { id: "QR01", name: "Missing customer ID", layer: "Silver", dimension: "Completeness", passed: 14875, failed: 125, status: "Warn" },
  { id: "QR02", name: "Duplicate order ID", layer: "Silver", dimension: "Uniqueness", passed: 14790, failed: 210, status: "Warn" },
  { id: "QR03", name: "Negative or zero quantity", layer: "Silver", dimension: "Validity", passed: 14955, failed: 45, status: "Pass" },
  { id: "QR04", name: "Negative product price", layer: "Silver", dimension: "Validity", passed: 14980, failed: 20, status: "Pass" },
  { id: "QR05", name: "Invalid email", layer: "Silver", dimension: "Validity", passed: 14910, failed: 90, status: "Warn" },
  { id: "QR06", name: "Invalid date", layer: "Silver", dimension: "Validity", passed: 14985, failed: 15, status: "Pass" },
  { id: "QR07", name: "Unknown region", layer: "Silver", dimension: "Consistency", passed: 14930, failed: 70, status: "Warn" },
  { id: "QR08", name: "Missing product reference", layer: "Silver", dimension: "Completeness", passed: 14970, failed: 30, status: "Pass" },
];

export interface RejectedRecord {
  id: string;
  sourceTable: string;
  rule: string;
  reason: string;
  rejectedAt: string;
}
export const rejectedRecords: RejectedRecord[] = [
  { id: "REJ-2001", sourceTable: "orders_raw", rule: "Missing customer ID", reason: "customer_id is null", rejectedAt: "2026-07-20 08:01" },
  { id: "REJ-2002", sourceTable: "orders_raw", rule: "Duplicate order ID", reason: "order_id O10001 already exists", rejectedAt: "2026-07-20 08:01" },
  { id: "REJ-2003", sourceTable: "orders_raw", rule: "Negative or zero quantity", reason: "quantity = 0", rejectedAt: "2026-07-20 08:01" },
  { id: "REJ-2004", sourceTable: "products_raw", rule: "Negative product price", reason: "price = -199", rejectedAt: "2026-07-20 08:02" },
  { id: "REJ-2005", sourceTable: "customers_raw", rule: "Invalid email", reason: "email missing @ symbol", rejectedAt: "2026-07-20 08:02" },
  { id: "REJ-2006", sourceTable: "orders_raw", rule: "Invalid date", reason: "date = 2026-13-40", rejectedAt: "2026-07-20 08:02" },
  { id: "REJ-2007", sourceTable: "customers_raw", rule: "Unknown region", reason: "region = 'Unknown'", rejectedAt: "2026-07-20 08:03" },
  { id: "REJ-2008", sourceTable: "orders_raw", rule: "Missing product reference", reason: "product_id not in products", rejectedAt: "2026-07-20 08:03" },
  { id: "REJ-2009", sourceTable: "orders_raw", rule: "Duplicate order ID", reason: "order_id O10014 already exists", rejectedAt: "2026-07-20 08:03" },
  { id: "REJ-2010", sourceTable: "customers_raw", rule: "Invalid email", reason: "email = 'abc@'", rejectedAt: "2026-07-20 08:04" },
];

export interface QualityTrendPoint {
  month: string;
  quality: number;
}
export const qualityTrend: QualityTrendPoint[] = [
  { month: "Feb", quality: 93.1 },
  { month: "Mar", quality: 93.8 },
  { month: "Apr", quality: 94.4 },
  { month: "May", quality: 94.9 },
  { month: "Jun", quality: 95.5 },
  { month: "Jul", quality: 95.9 },
  { month: "Aug", quality: 96.1 },
  { month: "Sep", quality: 96.0 },
  { month: "Oct", quality: 96.2 },
  { month: "Nov", quality: 96.3 },
  { month: "Dec", quality: 96.4 },
];

// Derived aggregates
export function revenueByCategory() {
  const map = new Map<string, number>();
  for (const p of products) map.set(p.category, (map.get(p.category) ?? 0) + p.revenue);
  return Array.from(map, ([category, revenue]) => ({ category, revenue }));
}
export function salesByRegion() {
  const map = new Map<string, { revenue: number; orders: number }>();
  for (const o of orders) {
    const cur = map.get(o.region) ?? { revenue: 0, orders: 0 };
    cur.revenue += o.revenue; cur.orders += 1;
    map.set(o.region, cur);
  }
  return Array.from(map, ([region, v]) => ({ region, ...v }));
}
export function salesBySegment() {
  const map = new Map<string, number>();
  for (const o of orders) map.set(o.segment, (map.get(o.segment) ?? 0) + o.revenue);
  return Array.from(map, ([segment, revenue]) => ({ segment, revenue }));
}
export function customersBySegment() {
  const map = new Map<string, number>();
  for (const c of customers) map.set(c.segment, (map.get(c.segment) ?? 0) + 1);
  return Array.from(map, ([segment, count]) => ({ segment, count }));
}
export function customersByRegion() {
  const map = new Map<string, number>();
  for (const c of customers) map.set(c.region, (map.get(c.region) ?? 0) + 1);
  return Array.from(map, ([region, count]) => ({ region, count }));
}
