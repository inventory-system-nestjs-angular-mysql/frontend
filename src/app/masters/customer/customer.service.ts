import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../core/services/base-api.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints.constants';
import {
  CreateCustomerModel,
  CustomerResponseModel,
  CustomerInvoiceModel,
} from '../../core/models/customer';

@Injectable({ providedIn: 'root' })
export class CustomerService extends BaseApiService {
  protected getEndpoint(): string {
    return API_ENDPOINTS.CUSTOMERS;
  }

  getCustomers(): Observable<CustomerResponseModel[]> {
    return this.get<CustomerResponseModel[]>();
  }

  getCustomer(id: string): Observable<CustomerResponseModel> {
    return this.get<CustomerResponseModel>(id);
  }

  createCustomer(customer: CreateCustomerModel): Observable<CustomerResponseModel> {
    return this.post<CustomerResponseModel>('', customer);
  }

  updateCustomer(id: string, customer: Partial<CreateCustomerModel>): Observable<CustomerResponseModel> {
    return this.patch<CustomerResponseModel>(id, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.delete<void>(id);
  }

  getCustomerInvoices(customerId: string): Observable<CustomerInvoiceModel[]> {
    return this.http.get<CustomerInvoiceModel[]>(
      `${this.baseUrl}${API_ENDPOINTS.INVOICES_BY_CUSTOMER(customerId)}`
    );
  }
}

