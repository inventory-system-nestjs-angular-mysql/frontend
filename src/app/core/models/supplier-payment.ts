export interface SupplierPaymentLineResponseModel {
  invoiceId: string | null;
  invoiceNo: string | null;
  amount: number;
  remark: string | null;
  dueDate: string | null;
  order: number;
}

export interface SupplierPaymentResponseModel {
  id: string;
  invoiceNo: string | null;
  date: string | null;
  supplierId: string | null;
  supplierCode: string | null;
  supplierName: string | null;
  currencyId: string | null;
  currencyName: string | null;
  warehouseId: string | null;
  warehouseName: string | null;
  remark: string | null;
  cash: number;
  bankTransfer: number;
  creditCard: number;
  debitCard: number;
  voucher: number;
  cheque: number;
  fromBankId: string | null;
  fromBankName: string | null;
  chequeNo: string | null;
  chequeDate: string | null;
  totalPaid: number;
  lines?: SupplierPaymentLineResponseModel[];
}

export interface OutstandingInvoiceModel {
  id: string;
  invoiceNo: string;
  date: string | null;
  dueDate: string | null;
  amount: number;
  balance: number;
  special: string;
}

export interface EditablePaymentLine extends OutstandingInvoiceModel {
  paid: number;
  paidInFull: boolean;
  remark: string;
}

export interface SupplierLookupModel {
  id: string;
  code: string;
  name: string;
}

export interface InvoiceLookupModel {
  supplierId: string | null;
  warehouseId: string | null;
  currencyId: string | null;
}

export interface CreateSupplierPaymentLineRequest {
  invoiceId: string;
  amount: number;
  dueDate?: string | null;
  remark?: string | null;
  order?: number;
}

export interface CreateSupplierPaymentRequest {
  invoiceNo: string;
  date: string;
  supplierId: string;
  supplierCode: string;
  currencyId?: string | null;
  warehouseId?: string | null;
  remark?: string | null;
  cash?: number;
  bankTransfer?: number;
  creditCard?: number;
  debitCard?: number;
  voucher?: number;
  cheque?: number;
  fromBankId?: string | null;
  chequeNo?: string | null;
  chequeDate?: string | null;
  lines: CreateSupplierPaymentLineRequest[];
}
