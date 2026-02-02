/**
 * Currency Response Model
 * Response DTO for currency
 */
export interface CurrencyResponseModel {
  id: string;
  currency: string;
  rate: number;
  taxRate: number;
  serialNumber: string | null;
}

