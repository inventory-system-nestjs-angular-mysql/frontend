import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreatePurchaseReturnRequest,
  PurchaseReturnResponseModel,
  OutstandingInvoiceModel,
} from '../../core/models/purchase-return';

@Injectable({ providedIn: 'root' })
export class PurchaseReturnService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.PURCHASE_RETURN;
  }

  getPurchaseReturnList(): Observable<PurchaseReturnResponseModel[]> {
    return this.get<PurchaseReturnResponseModel[]>();
  }

  getPurchaseReturn(id: string): Observable<PurchaseReturnResponseModel> {
    return this.get<PurchaseReturnResponseModel>(id);
  }

  createPurchaseReturn(data: CreatePurchaseReturnRequest): Observable<PurchaseReturnResponseModel> {
    return this.post<PurchaseReturnResponseModel>('', data);
  }

  updatePurchaseReturn(id: string, data: CreatePurchaseReturnRequest): Observable<PurchaseReturnResponseModel> {
    return this.patch<PurchaseReturnResponseModel>(id, data);
  }

  deletePurchaseReturn(id: string): Observable<void> {
    return this.delete<void>(id);
  }

  getOutstandingInvoices(supplierId: string, currencyId: string): Observable<OutstandingInvoiceModel[]> {
    return this.get<OutstandingInvoiceModel[]>('outstanding-invoices', { supplierId, currencyId });
  }
}
