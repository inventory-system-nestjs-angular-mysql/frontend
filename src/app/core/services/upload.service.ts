import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UploadResponse {
  filename: string;
  originalName: string;
  path: string;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadResponse>(`${this.baseUrl}/upload/image`, formData);
  }

  /** Get image as base64 data URL from backend by image path (e.g. images/abc.jpg). Frontend can use the dataUrl as img src. */
  getImageAsBase64(path: string | null | undefined): Observable<{ dataUrl: string }> {
    if (!path?.trim()) return of({ dataUrl: '' });
    if (path.startsWith('data:')) return of({ dataUrl: path });
    const url = `${this.baseUrl}/upload/base64?path=${encodeURIComponent(path)}`;
    return this.http.get<{ dataUrl: string }>(url);
  }

   getImageUrl(path: string | null | undefined): string {
    if (!path) return '';
    // If path already starts with http, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // If path starts with /uploads, prepend base URL
    if (path.startsWith('/uploads')) {
      return `${this.baseUrl}${path}`;
    }
    // Otherwise, assume it's a relative path
    return `${this.baseUrl}/uploads/images/${path}`;
  }
}

