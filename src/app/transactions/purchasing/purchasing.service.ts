import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreatePurchasingRequest,
  PurchasingResponseModel,
} from '../../core/models/purchasing';

@Injectable({ providedIn: 'root' })
export class PurchasingService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.PURCHASING;
  }

  getPurchasingList(): Observable<PurchasingResponseModel[]> {
    return this.get<PurchasingResponseModel[]>();
  }

  getPurchasing(id: string): Observable<PurchasingResponseModel> {
    return this.get<PurchasingResponseModel>(id);
  }

  createPurchasing(data: CreatePurchasingRequest): Observable<PurchasingResponseModel> {
    return this.post<PurchasingResponseModel>('', data);
  }

  updatePurchasing(id: string, data: CreatePurchasingRequest): Observable<PurchasingResponseModel> {
    return this.patch<PurchasingResponseModel>(id, data);
  }

  deletePurchasing(id: string): Observable<void> {
    return this.delete<void>(id);
  }
}
