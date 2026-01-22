/**
 * Bank Response Model
 * Response DTO for bank
 */
export interface BankResponseModel {
  id: string;
  description: string;
  gl: string | null;
  account: string | null;
  serialNumber: string | null;
}

