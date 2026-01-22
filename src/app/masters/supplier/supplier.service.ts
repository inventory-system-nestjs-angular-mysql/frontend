import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateSupplierModel,
  SupplierResponseModel,
} from '../../core/models/supplier';

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
}

