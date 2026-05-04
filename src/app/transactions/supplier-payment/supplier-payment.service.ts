import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  SupplierPaymentResponseModel,
  CreateSupplierPaymentRequest,
  OutstandingInvoiceModel,
  SupplierLookupModel,
  InvoiceLookupModel,
} from '../../core/models/supplier-payment';

@Injectable({ providedIn: 'root' })
export class SupplierPaymentService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.SUPPLIER_PAYMENT;
  }

  getList(): Observable<SupplierPaymentResponseModel[]> {
    return this.get<SupplierPaymentResponseModel[]>();
  }

  getOne(id: string): Observable<SupplierPaymentResponseModel> {
    return this.get<SupplierPaymentResponseModel>(id);
  }

  getNextInvoiceNo(): Observable<string> {
    return this.get<string>('next-invoice-no');
  }

  getOutstandingInvoices(supplierId: string, currencyId: string): Observable<OutstandingInvoiceModel[]> {
    return this.get<OutstandingInvoiceModel[]>('outstanding-invoices', { supplierId, currencyId });
  }

  searchByInvoice(invoiceNo: string): Observable<InvoiceLookupModel | null> {
    return this.get<InvoiceLookupModel | null>('search-by-invoice', { invoiceNo });
  }

  searchSupplierByName(name: string): Observable<SupplierLookupModel[]> {
    return this.get<SupplierLookupModel[]>('search-supplier', { name });
  }

  create(data: CreateSupplierPaymentRequest): Observable<SupplierPaymentResponseModel> {
    return this.post<SupplierPaymentResponseModel>('', data);
  }

  update(id: string, data: CreateSupplierPaymentRequest): Observable<SupplierPaymentResponseModel> {
    return this.patch<SupplierPaymentResponseModel>(id, data);
  }

  deletePayment(id: string): Observable<void> {
    return this.delete<void>(id);
  }
}
