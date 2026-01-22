import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateSalesmanModel,
  SalesmanResponseModel,
} from '../../core/models/salesman';

@Injectable({ providedIn: 'root' })
export class SalesmanService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.SALESMEN;
  }

  getSalesmen(): Observable<SalesmanResponseModel[]> {
    return this.get<SalesmanResponseModel[]>();
  }

  getSalesman(id: string): Observable<SalesmanResponseModel> {
    return this.get<SalesmanResponseModel>(id);
  }

  createSalesman(salesman: CreateSalesmanModel): Observable<SalesmanResponseModel> {
    return this.post<SalesmanResponseModel>('', salesman);
  }

  updateSalesman(id: string, salesman: Partial<CreateSalesmanModel>): Observable<SalesmanResponseModel> {
    return this.patch<SalesmanResponseModel>(id, salesman);
  }

  deleteSalesman(id: string): Observable<void> {
    return this.delete<void>(id);
  }
}

