import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';

/**
 * HTTP Error Interceptor
 * Handles HTTP errors globally and shows user-friendly messages
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad Request: Please check your input';
            break;
          case 401:
            errorMessage = 'Unauthorized: Please login again';
            // Could redirect to login here
            break;
          case 403:
            errorMessage = 'Forbidden: You do not have permission to perform this action';
            break;
          case 404:
            errorMessage = error.error?.message || 'Resource not found';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflict: This resource already exists';
            break;
          case 422:
            errorMessage = error.error?.message || 'Validation Error: Please check your input';
            break;
          case 500:
            errorMessage = 'Server Error: Please try again later';
            break;
          case 503:
            errorMessage = 'Service Unavailable: Please try again later';
            break;
          default:
            errorMessage = error.error?.message || `Error: ${error.status} ${error.statusText}`;
        }
      }

      // Show error message to user
      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 5000
      });

      // Log error for debugging (only in development)
      if (!environment.production) {
        console.error('HTTP Error:', {
          url: req.url,
          status: error.status,
          message: errorMessage,
          error: error.error
        });
      }

      return throwError(() => error);
    })
  );
};

