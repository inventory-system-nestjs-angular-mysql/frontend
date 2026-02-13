/**
 * Stock Opening Balance line item (UI + API)
 * References stock detail (stock + unit); unit is auto-filled from stock detail.
 */
export interface StockOpeningBalanceLineModel {
  stockDetailId: string;
  stockCode?: string | null;
  stockName?: string | null;
  prevStock?: number; // UI only - previous stock qty
  qty: number;
  unit?: string | null; // auto-filled from stock detail (unit id)
  unitDescription?: string | null; // UI display only
  purchasePrice: number;
  amount: number;
}

/**
 * Request payload for creating Stock Opening Balance
 */
export interface CreateStockOpeningBalanceRequest {
  refNo: string;
  date: string; // ISO date
  warehouseId: string;
  remark?: string | null;
  lines: {
    stockDetailId: string;
    stockCode?: string | null;
    stockName?: string | null;
    qty: number;
    unit?: string | null;
    purchasePrice: number;
    amount: number;
  }[];
}

/**
 * Response from creating Stock Opening Balance (invoice summary)
 */
export interface StockOpeningBalanceResponse {
  id: string;
  invoice: string;
  date: Date | string;
  warehouse: string;
  currency: string;
  amount: number;
  remark?: string | null;
  rem?: number | null;
}
