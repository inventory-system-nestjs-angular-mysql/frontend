import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateStockModel,
  StockResponseModel,
  CreateStockDetailModel,
  StockDetailResponseModel,
} from '../../core/models/stock';

@Injectable({ providedIn: 'root' })
export class StockService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.STOCKS;
  }

  getStocks(): Observable<StockResponseModel[]> {
    return this.get<StockResponseModel[]>();
  }

  getStock(id: string): Observable<StockResponseModel> {
    return this.get<StockResponseModel>(id);
  }

  createStock(stock: CreateStockModel): Observable<StockResponseModel> {
    return this.post<StockResponseModel>('', stock);
  }

  updateStock(id: string, stock: Partial<CreateStockModel>): Observable<StockResponseModel> {
    return this.patch<StockResponseModel>(id, stock);
  }

  deleteStock(id: string): Observable<void> {
    return this.delete<void>(id);
  }

  // Stock Detail methods
  getStockDetails(stockId: string): Observable<StockDetailResponseModel[]> {
    return this.get<StockDetailResponseModel[]>(`${stockId}/details`);
  }

  getStockDetail(id: string): Observable<StockDetailResponseModel> {
    return this.get<StockDetailResponseModel>(`details/${id}`);
  }

  createStockDetail(stockId: string, detail: CreateStockDetailModel): Observable<StockDetailResponseModel> {
    return this.post<StockDetailResponseModel>(`${stockId}/details`, detail);
  }

  updateStockDetail(id: string, detail: Partial<CreateStockDetailModel>): Observable<StockDetailResponseModel> {
    return this.patch<StockDetailResponseModel>(`details/${id}`, detail);
  }

  deleteStockDetail(id: string): Observable<void> {
    return this.delete<void>(`details/${id}`);
  }
}

