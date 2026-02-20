import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateStockOpeningBalanceRequest,
  StockOpeningBalanceResponse,
  OpeningBalanceDetail,
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

  getOpeningBalances(): Observable<StockOpeningBalanceResponse[]> {
    return this.get<StockOpeningBalanceResponse[]>('opening-balance');
  }

  getOpeningBalanceDetail(id: string): Observable<OpeningBalanceDetail> {
    return this.get<OpeningBalanceDetail>(`opening-balance/${id}`);
  }

  updateOpeningBalance(
    id: string,
    body: CreateStockOpeningBalanceRequest
  ): Observable<StockOpeningBalanceResponse> {
    return this.patch<StockOpeningBalanceResponse>(`opening-balance/${id}`, body);
  }
}
