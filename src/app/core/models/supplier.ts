/**
 * Supplier Models
 * Models for Supplier entity matching backend DTOs
 */

export interface SupplierResponseModel {
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
  nppkp?: string | null;
  creditLimit?: number;
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
}

export interface CreateSupplierModel {
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
}

