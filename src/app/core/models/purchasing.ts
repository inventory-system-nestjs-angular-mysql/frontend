export interface PurchasingLineResponseModel {
  id: string;
  stockId: string | null;
  stockCode: string | null;
  stockName: string | null;
  unit: string | null;
  qty: number;
  price: number;
  disc1: number;
  disc2: number;
  disc3: number;
  disc: number;
  amount: number | null;
  onHand: number;
  order: number;
  taxable: boolean;
}

export interface PurchasingResponseModel {
  id: string;
  invoiceNo: string | null;
  date: string | null;
  dueDate: string | null;
  supplierId: string | null;
  supplierName: string | null;
  warehouseId: string | null;
  warehouseName: string | null;
  currencyId: string | null;
  currencyName: string | null;
  isCash: boolean;
  discount1: number;
  discount2: number;
  discount3: number;
  discount: number;
  freight: number;
  freightPct: number;
  tax: number;
  po: string | null;
  taxInvoice: string | null;
  remark: string | null;
  sj: string | null;
  tglSj: string | null;
  isPaid: boolean;
  scan1: string | null;
  scan2: string | null;
  scan3: string | null;
  scan4: string | null;
  totalAmount: number;
  lines?: PurchasingLineResponseModel[];
}

export interface PurchasingLineRequest {
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

export interface CreatePurchasingRequest {
  invoiceNo: string;
  date: string;
  supplierId: string;
  warehouseId: string;
  currencyId?: string | null;
  dueDate?: string | null;
  isCash?: boolean;
  discount1?: number;
  discount2?: number;
  discount3?: number;
  discount?: number;
  freight?: number;
  freightPct?: number;
  tax?: number;
  po?: string | null;
  taxInvoice?: string | null;
  remark?: string | null;
  sj?: string | null;
  tglSj?: string | null;
  isPaid?: boolean;
  scan1?: string | null;
  scan2?: string | null;
  scan3?: string | null;
  scan4?: string | null;
  lines: PurchasingLineRequest[];
}

// Editable line for the form
export interface EditablePurchasingLine {
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
