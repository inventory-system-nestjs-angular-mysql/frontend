/**
 * Customer Models
 * Models for Customer entity matching backend DTOs
 */

export interface CustomerResponseModel {
  id: string;
  code: string;
  name: string;
  cityId?: string | null;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
  address4?: string | null;
  address5?: string | null;
  npwp?: string | null; // TIN
  nppkp?: string | null; // Legacy TIN
  creditLimit?: number;
  outstandingLimit?: number;
  discount?: number;
  term?: number;
  billToSame?: boolean;
  billToName?: string | null;
  billToAddress1?: string | null;
  billToAddress2?: string | null;
  billToAddress3?: string | null;
  billToAddress4?: string | null;
  createDate?: Date | null;
  lastDate?: Date | null;
  isSuspended?: boolean;
  memo?: string | null;
  imagePath?: string | null;
  visitFrequency?: number | null;
  email?: string | null;
  email2?: string | null;
  email3?: string | null;
  zip?: string | null;
  telephone?: string | null;
  birthday?: Date | null;
  religion?: string | null;
  distance?: number | null;
  freight?: number | null;
  priceType?: number | null; // 1=ISX, 2=POSX, 3=All
  salesmanId?: string | null;
  gender?: number | null; // 0=Male, 1=Female
  nik?: string | null;
}

export interface CreateCustomerModel {
  code: string;
  name: string;
  cityId?: string | null;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
  address4?: string | null;
  address5?: string | null;
  npwp?: string | null;
  nppkp?: string | null;
  creditLimit?: number;
  outstandingLimit?: number;
  discount?: number;
  term?: number;
  billToSame?: boolean;
  billToName?: string | null;
  billToAddress1?: string | null;
  billToAddress2?: string | null;
  billToAddress3?: string | null;
  billToAddress4?: string | null;
  createDate?: Date | null;
  lastDate?: Date | null;
  isSuspended?: boolean;
  memo?: string | null;
  imagePath?: string | null;
  visitFrequency?: number | null;
  email?: string | null;
  email2?: string | null;
  email3?: string | null;
  zip?: string | null;
  telephone?: string | null;
  birthday?: Date | null;
  religion?: string | null;
  distance?: number | null;
  freight?: number | null;
  priceType?: number | null;
  salesmanId?: string | null;
  gender?: number | null;
  nik?: string | null;
}

export interface CustomerInvoiceModel {
  invoice: string;
  date: Date | string;
  warehouse: string;
  currency: string;
  amount: number;
  remark?: string | null;
  rem?: number | null; // Remaining amount
}

