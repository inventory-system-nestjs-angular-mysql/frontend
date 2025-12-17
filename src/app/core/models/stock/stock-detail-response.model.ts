/**
 * Stock Detail Response Model
 * Response DTO for stock detail
 */
export interface StockDetailResponseModel {
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

