import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateCityModel,
  CityResponseModel,
} from '../../core/models/city';

@Injectable({ providedIn: 'root' })
export class CityService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.CITIES;
  }

  getCities(): Observable<CityResponseModel[]> {
    return this.get<CityResponseModel[]>();
  }

  getCity(id: string): Observable<CityResponseModel> {
    return this.get<CityResponseModel>(id);
  }

  createCity(city: CreateCityModel): Observable<CityResponseModel> {
    return this.post<CityResponseModel>('', city);
  }

  updateCity(id: string, city: Partial<CreateCityModel>): Observable<CityResponseModel> {
    return this.patch<CityResponseModel>(id, city);
  }

  deleteCity(id: string): Observable<void> {
    return this.delete<void>(id);
  }
}

