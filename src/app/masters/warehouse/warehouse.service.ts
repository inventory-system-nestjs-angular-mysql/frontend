import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateWarehouseModel,
  WarehouseResponseModel,
} from '../../core/models/warehouse';

@Injectable({ providedIn: 'root' })
export class WarehouseService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.WAREHOUSES;
  }

  getWarehouses(): Observable<WarehouseResponseModel[]> {
    return this.get<WarehouseResponseModel[]>();
  }

  getWarehouse(id: string): Observable<WarehouseResponseModel> {
    return this.get<WarehouseResponseModel>(id);
  }

  createWarehouse(warehouse: CreateWarehouseModel): Observable<WarehouseResponseModel> {
    return this.post<WarehouseResponseModel>('', warehouse);
  }

  updateWarehouse(id: string, warehouse: Partial<CreateWarehouseModel>): Observable<WarehouseResponseModel> {
    return this.patch<WarehouseResponseModel>(id, warehouse);
  }

  deleteWarehouse(id: string): Observable<void> {
    return this.delete<void>(id);
  }
}

