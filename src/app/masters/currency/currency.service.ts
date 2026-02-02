import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateCurrencyModel,
  CurrencyResponseModel,
} from '../../core/models/currency';

@Injectable({ providedIn: 'root' })
export class CurrencyService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.CURRENCIES;
  }

  getCurrencies(): Observable<CurrencyResponseModel[]> {
    return this.get<CurrencyResponseModel[]>();
  }

  getCurrency(id: string): Observable<CurrencyResponseModel> {
    return this.get<CurrencyResponseModel>(id);
  }

  createCurrency(currency: CreateCurrencyModel): Observable<CurrencyResponseModel> {
    return this.post<CurrencyResponseModel>('', currency);
  }

  updateCurrency(id: string, currency: Partial<CreateCurrencyModel>): Observable<CurrencyResponseModel> {
    return this.patch<CurrencyResponseModel>(id, currency);
  }

  deleteCurrency(id: string): Observable<void> {
    return this.delete<void>(id);
  }
}

