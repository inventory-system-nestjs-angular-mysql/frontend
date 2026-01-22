/**
 * Salesman Models
 * Models for Salesman entity matching backend DTOs
 */

export interface SalesmanResponseModel {
  id: string;
  name: string;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
  lastDate?: Date | null;
  commission?: number | null;
  isSuspended?: boolean;
  memo?: string | null;
  imagePath?: string | null;
  special?: string | null;
}

export interface CreateSalesmanModel {
  name: string;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
  lastDate?: Date | null;
  commission?: number | null;
  isSuspended?: boolean;
  memo?: string | null;
  imagePath?: string | null;
  special?: string | null;
}

