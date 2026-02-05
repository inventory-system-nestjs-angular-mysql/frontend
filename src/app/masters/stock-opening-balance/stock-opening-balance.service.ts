import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateStockOpeningBalanceRequest,
  StockOpeningBalanceResponse,
} from '../../core/models/stock-opening-balance.model';

@Injectable({ providedIn: 'root' })
export class StockOpeningBalanceService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.INVOICES;
  }

  createOpeningBalance(
    body: CreateStockOpeningBalanceRequest
  ): Observable<StockOpeningBalanceResponse> {
    return this.post<StockOpeningBalanceResponse>('opening-balance', body);
  }
}
