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
} as const;

