/**
 * Create Stock Detail Model
 * DTO for creating a stock detail entry
 */
export interface CreateStockDetailModel {
  stockCode: string;
  unit: string;
  factor?: number;
  purchase?: number;
  wholesale?: number;
  retail?: number;
  priceDollar?: number;
  price3?: number;
  price4?: number;
  price5?: number;
  isKey?: boolean;
}

