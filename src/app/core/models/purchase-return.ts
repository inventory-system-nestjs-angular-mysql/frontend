import { PurchasingLineResponseModel, PurchasingResponseModel, PurchasingLineRequest, CreatePurchasingRequest } from './purchasing';

export interface PurchaseReturnLineResponseModel extends PurchasingLineResponseModel {}

export interface PurchaseReturnResponseModel extends Omit<PurchasingResponseModel, 'lines'> {
  returnTo: string | null;
  invoiceReturnTo: string | null;
  lines?: PurchaseReturnLineResponseModel[];
}

export interface CreatePurchaseReturnRequest extends Omit<CreatePurchasingRequest, 'lines'> {
  returnTo?: string | null;
  invoiceReturnTo?: string | null;
  lines: PurchasingLineRequest[];
}

export interface OutstandingInvoiceModel {
  id: string;
  invoiceNo: string;
  date: string;
  invoiceAmount: number;
  paidAmount: number;
  balance: number;
}
