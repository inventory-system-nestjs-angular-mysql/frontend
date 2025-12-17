/**
 * Create Unit Model
 * DTO for creating a new unit
 */
export interface CreateUnitModel {
  description: string;
  serialNumber?: string | null;
  coreTax?: string | null;
}

