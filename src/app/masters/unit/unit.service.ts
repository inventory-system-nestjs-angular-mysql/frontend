import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateUnitModel,
  UnitResponseModel,
} from '../../core/models/unit';

@Injectable({ providedIn: 'root' })
export class UnitService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.UNITS;
  }

  getUnits(): Observable<UnitResponseModel[]> {
    return this.get<UnitResponseModel[]>();
  }

  getUnit(id: string): Observable<UnitResponseModel> {
    return this.get<UnitResponseModel>(id);
  }

  createUnit(unit: CreateUnitModel): Observable<UnitResponseModel> {
    return this.post<UnitResponseModel>('', unit);
  }

  updateUnit(id: string, unit: Partial<CreateUnitModel>): Observable<UnitResponseModel> {
    return this.patch<UnitResponseModel>(id, unit);
  }

  deleteUnit(id: string): Observable<void> {
    return this.delete<void>(id);
  }
}

