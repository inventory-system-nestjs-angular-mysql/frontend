import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateSupplierModel,
  SupplierResponseModel,
} from '../../core/models/supplier';
import { CustomerInvoiceModel, EditableInvoiceModel } from '../../core/models/customer';

@Injectable({ providedIn: 'root' })
export class SupplierService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.SUPPLIERS;
  }

  getSuppliers(): Observable<SupplierResponseModel[]> {
    return this.get<SupplierResponseModel[]>();
  }

  getSupplier(id: string): Observable<SupplierResponseModel> {
    return this.get<SupplierResponseModel>(id);
  }

  createSupplier(supplier: CreateSupplierModel): Observable<SupplierResponseModel> {
    return this.post<SupplierResponseModel>('', supplier);
  }

  updateSupplier(id: string, supplier: Partial<CreateSupplierModel>): Observable<SupplierResponseModel> {
    return this.patch<SupplierResponseModel>(id, supplier);
  }

  deleteSupplier(id: string): Observable<void> {
    return this.delete<void>(id);
  }

  getSupplierInvoices(supplierId: string): Observable<CustomerInvoiceModel[]> {
    return this.http.get<CustomerInvoiceModel[]>(
      `${this.baseUrl}${API_ENDPOINTS.INVOICES_BY_SUPPLIER(supplierId)}`
    );
  }

  createSupplierInvoices(supplierId: string, invoices: any[]): Observable<any> {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.INVOICES}/supplier/${supplierId}/bulk`,
      { invoices }
    );
  }

  updateInvoice(invoiceId: string, invoice: any): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}${API_ENDPOINTS.INVOICE_BY_ID(invoiceId)}`,
      invoice
    );
  }

  deleteInvoice(invoiceId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_ENDPOINTS.INVOICE_BY_ID(invoiceId)}`
    );
  }
}

