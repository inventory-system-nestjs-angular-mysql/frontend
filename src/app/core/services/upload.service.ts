import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

