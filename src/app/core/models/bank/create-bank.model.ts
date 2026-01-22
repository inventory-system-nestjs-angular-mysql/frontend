/**
 * Create Bank Model
 * DTO for creating a new bank
 */
export interface CreateBankModel {
  description: string;
  gl?: string | null;
  account?: string | null;
  serialNumber?: string | null;
}

