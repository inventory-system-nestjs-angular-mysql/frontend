import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Base API Service
 * Provides common HTTP methods and base URL configuration
 * All API services should extend this class
 */
@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {
  protected http = inject(HttpClient);
  protected readonly baseUrl = environment.apiUrl;

  /**
   * Get the endpoint path for this service
   * Must be implemented by child classes
   */
  protected abstract getEndpoint(): string;

  /**
   * Get full URL for an endpoint
   */
  protected getUrl(path: string = ''): string {
    const endpoint = this.getEndpoint();
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${this.baseUrl}${endpoint}${cleanPath ? `/${cleanPath}` : ''}`;
  }

  /**
   * GET request
   */
  protected get<T>(path: string = '', params?: HttpParams | Record<string, any>): Observable<T> {
    const url = this.getUrl(path);
    const httpParams = params instanceof HttpParams 
      ? params 
      : this.createHttpParams(params);
    
    return this.http.get<T>(url, { params: httpParams });
  }

  /**
   * POST request
   */
  protected post<T>(path: string = '', body: any, options?: { headers?: HttpHeaders }): Observable<T> {
    const url = this.getUrl(path);
    return this.http.post<T>(url, body, options);
  }

  /**
   * PATCH request
   */
  protected patch<T>(path: string = '', body: any, options?: { headers?: HttpHeaders }): Observable<T> {
    const url = this.getUrl(path);
    return this.http.patch<T>(url, body, options);
  }

  /**
   * PUT request
   */
  protected put<T>(path: string = '', body: any, options?: { headers?: HttpHeaders }): Observable<T> {
    const url = this.getUrl(path);
    return this.http.put<T>(url, body, options);
  }

  /**
   * DELETE request
   */
  protected delete<T>(path: string = ''): Observable<T> {
    const url = this.getUrl(path);
    return this.http.delete<T>(url);
  }

  /**
   * Convert object to HttpParams
   */
  private createHttpParams(params?: Record<string, any>): HttpParams | undefined {
    if (!params) return undefined;
    
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }
}

