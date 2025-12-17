/**
 * Stock Price Row Model
 * Represents a price row in the stock detail/price table
 */
export interface StockPriceRow {
  stockCode: string;
  unit: string;
  factor: number;
  purchase: number;
  wholesale: number;
  retail: number;
  priceDollar?: number;
  price3?: number;
  price4?: number;
  price5?: number;
  isKey: boolean;
}

