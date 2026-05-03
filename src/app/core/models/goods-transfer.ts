import { PurchasingLineResponseModel } from './purchasing';

export interface GoodsTransferLineResponseModel extends PurchasingLineResponseModel {}

export interface GoodsTransferResponseModel {
  id: string;
  invoiceNo: string | null;
  date: string | null;
  dueDate: string | null;
  fromWarehouseId: string | null;
  fromWarehouseName: string | null;
  toWarehouseId: string | null;
  toWarehouseName: string | null;
  currencyId: string | null;
  currencyName: string | null;
  discount1: number;
  discount2: number;
  discount3: number;
  discount: number;
  freight: number;
  freightPct: number;
  tax: number;
  remark: string | null;
  sj: string | null;
  tglSj: string | null;
  scan1: string | null;
  scan2: string | null;
  scan3: string | null;
  scan4: string | null;
  totalAmount: number;
  lines?: GoodsTransferLineResponseModel[];
}

export interface GoodsTransferLineRequest {
  stockId: string;
  stockCode?: string | null;
  unit?: string | null;
  qty: number;
  price: number;
  disc1?: number;
  disc2?: number;
  disc3?: number;
  disc?: number;
  amount?: number | null;
  onHand?: number;
  taxable?: boolean;
}

export interface CreateGoodsTransferRequest {
  invoiceNo: string;
  date: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  currencyId?: string | null;
  dueDate?: string | null;
  discount1?: number;
  discount2?: number;
  discount3?: number;
  discount?: number;
  freight?: number;
  freightPct?: number;
  tax?: number;
  remark?: string | null;
  sj?: string | null;
  tglSj?: string | null;
  scan1?: string | null;
  scan2?: string | null;
  scan3?: string | null;
  scan4?: string | null;
  lines: GoodsTransferLineRequest[];
}

export interface EditableGoodsTransferLine {
  stockId: string;
  stockCode: string;
  stockName: string;
  unit: string;
  qty: number;
  price: number;
  disc1: number;
  disc2: number;
  disc3: number;
  disc: number;
  amount: number;
  onHand: number;
  taxable: boolean;
}
