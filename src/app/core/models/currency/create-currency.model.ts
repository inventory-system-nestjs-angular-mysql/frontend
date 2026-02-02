/**
 * Create Currency Model
 * Request DTO for creating currency
 */
export interface CreateCurrencyModel {
  currency: string;
  rate: number;
  taxRate?: number;
  serialNumber?: string | null;
}

