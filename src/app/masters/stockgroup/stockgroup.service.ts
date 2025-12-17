import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateStockGroupModel,
  StockGroupResponseModel,
} from '../../core/models/stockgroup';

@Injectable({ providedIn: 'root' })
export class StockGroupService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.STOCK_GROUPS;
  }

  getStockGroups(): Observable<StockGroupResponseModel[]> {
    return this.get<StockGroupResponseModel[]>();
  }

  getStockGroup(id: string): Observable<StockGroupResponseModel> {
    return this.get<StockGroupResponseModel>(id);
  }

  createStockGroup(stockGroup: CreateStockGroupModel): Observable<StockGroupResponseModel> {
    return this.post<StockGroupResponseModel>('', stockGroup);
  }

  updateStockGroup(id: string, stockGroup: Partial<CreateStockGroupModel>): Observable<StockGroupResponseModel> {
    return this.patch<StockGroupResponseModel>(id, stockGroup);
  }

  deleteStockGroup(id: string): Observable<void> {
    return this.delete<void>(id);
  }
}
