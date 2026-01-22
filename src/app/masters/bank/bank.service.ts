import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateBankModel,
  BankResponseModel,
} from '../../core/models/bank';

@Injectable({ providedIn: 'root' })
export class BankService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.BANKS;
  }

  getBanks(): Observable<BankResponseModel[]> {
    return this.get<BankResponseModel[]>();
  }

  getBank(id: string): Observable<BankResponseModel> {
    return this.get<BankResponseModel>(id);
  }

  createBank(bank: CreateBankModel): Observable<BankResponseModel> {
    return this.post<BankResponseModel>('', bank);
  }

  updateBank(id: string, bank: Partial<CreateBankModel>): Observable<BankResponseModel> {
    return this.patch<BankResponseModel>(id, bank);
  }

  deleteBank(id: string): Observable<void> {
    return this.delete<void>(id);
  }
}

