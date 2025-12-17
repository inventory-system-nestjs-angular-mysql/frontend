/**
 * Unit Response Model
 * Response DTO for unit
 */
export interface UnitResponseModel {
  id: string;
  description: string;
  serialNumber: string | null;
  coreTax: string | null;
}

