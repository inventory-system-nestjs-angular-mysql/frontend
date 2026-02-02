/**
 * API Endpoints Constants
 * Centralized management of all API endpoint paths
 */
export const API_ENDPOINTS = {
  // Stock endpoints
  STOCKS: '/stocks',
  STOCK_BY_ID: (id: string) => `/stocks/${id}`,
  STOCK_DETAILS: (stockId: string) => `/stocks/${stockId}/details`,
  STOCK_DETAIL_BY_ID: (id: string) => `/stocks/details/${id}`,

  // Stock Group endpoints
  STOCK_GROUPS: '/stockgroups',
  STOCK_GROUP_BY_ID: (id: string) => `/stockgroups/${id}`,

  // Unit endpoints
  UNITS: '/units',
  UNIT_BY_ID: (id: string) => `/units/${id}`,

  // Bank endpoints
  BANKS: '/banks',
  BANK_BY_ID: (id: string) => `/banks/${id}`,

  // Warehouse endpoints
  WAREHOUSES: '/warehouses',
  WAREHOUSE_BY_ID: (id: string) => `/warehouses/${id}`,

  // Brand endpoints
  BRANDS: '/brands',
  BRAND_BY_ID: (id: string) => `/brands/${id}`,

  // City endpoints
  CITIES: '/cities',
  CITY_BY_ID: (id: string) => `/cities/${id}`,

  // Supplier endpoints
  SUPPLIERS: '/suppliers',
  SUPPLIER_BY_ID: (id: string) => `/suppliers/${id}`,

  // Customer endpoints
  CUSTOMERS: '/customers',
  CUSTOMER_BY_ID: (id: string) => `/customers/${id}`,

  // Salesman endpoints
  SALESMEN: '/salesmen',
  SALESMAN_BY_ID: (id: string) => `/salesmen/${id}`,

  // Invoice endpoints
  INVOICES: '/invoices',
  INVOICE_BY_ID: (id: string) => `/invoices/${id}`,
  INVOICES_BY_CUSTOMER: (customerId: string) => `/invoices/customer/${customerId}`,
  INVOICES_BY_SUPPLIER: (supplierId: string) => `/invoices/supplier/${supplierId}`,

  // Currency endpoints
  CURRENCIES: '/currencies',
  CURRENCY_BY_ID: (id: string) => `/currencies/${id}`,

  // Upload endpoints
  UPLOAD_IMAGE: '/upload/image',
} as const;

