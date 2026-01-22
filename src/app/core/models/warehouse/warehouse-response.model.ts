/**
 * Warehouse Response Model
 * Response DTO for warehouse
 */
export interface WarehouseResponseModel {
  id: string;
  description: string;
  serialNumber: string | null;
  refNo: string | null;
  kepalaSeri: string | null;
  option: number | null;
  cr: number | null;
  kepalaSeri1: string | null;
  kepalaSeri2: string | null;
  kepalaSeri3: string | null;
  kepalaSeri4: string | null;
  kepalaSeri5: string | null;
  refNo1: string | null;
  refNo2: string | null;
  refNo3: string | null;
  refNo4: string | null;
  refNo5: string | null;
  lok1: string | null;
  lok2: string | null;
  lok3: string | null;
  min: number | null;
  max: number | null;
  slipat: number | null;
  kepalaSeri1b: string | null;
  kepalaSeri1c: string | null;
  refNo1b: string | null;
  refNo1c: string | null;
}

