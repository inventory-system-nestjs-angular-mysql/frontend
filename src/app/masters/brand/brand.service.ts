import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateBrandModel,
  BrandResponseModel,
} from '../../core/models/brand';

@Injectable({ providedIn: 'root' })
export class BrandService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.BRANDS;
  }

  getBrands(): Observable<BrandResponseModel[]> {
    return this.get<BrandResponseModel[]>();
  }

  getBrand(id: string): Observable<BrandResponseModel> {
    return this.get<BrandResponseModel>(id);
  }

  createBrand(brand: CreateBrandModel): Observable<BrandResponseModel> {
    return this.post<BrandResponseModel>('', brand);
  }

  updateBrand(id: string, brand: Partial<CreateBrandModel>): Observable<BrandResponseModel> {
    return this.patch<BrandResponseModel>(id, brand);
  }

  deleteBrand(id: string): Observable<void> {
    return this.delete<void>(id);
  }
}

