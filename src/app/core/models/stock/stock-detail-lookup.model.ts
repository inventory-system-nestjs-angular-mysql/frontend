/**
 * Stock detail lookup item for opening balance / invoice line selection
 * Each item represents a stock with a specific unit (stock detail)
 */
export interface StockDetailLookupModel {
  id: string;
  stockId: string;
  stockName: string;
  stockCode: string;
  unit: string; // unit id
  unitDescription?: string;
  purchase: number;
}
