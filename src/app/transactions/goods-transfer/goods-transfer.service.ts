import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import { CreateGoodsTransferRequest, GoodsTransferResponseModel } from '../../core/models/goods-transfer';

@Injectable({ providedIn: 'root' })
export class GoodsTransferService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.GOODS_TRANSFER;
  }

  getGoodsTransferList(): Observable<GoodsTransferResponseModel[]> {
    return this.get<GoodsTransferResponseModel[]>();
  }

  getGoodsTransfer(id: string): Observable<GoodsTransferResponseModel> {
    return this.get<GoodsTransferResponseModel>(id);
  }

  createGoodsTransfer(data: CreateGoodsTransferRequest): Observable<GoodsTransferResponseModel> {
    return this.post<GoodsTransferResponseModel>('', data);
  }

  updateGoodsTransfer(id: string, data: CreateGoodsTransferRequest): Observable<GoodsTransferResponseModel> {
    return this.patch<GoodsTransferResponseModel>(id, data);
  }

  deleteGoodsTransfer(id: string): Observable<void> {
    return this.delete<void>(id);
  }
}
