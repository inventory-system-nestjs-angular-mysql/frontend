import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * HTTP Loading Interceptor
 * Manages loading state for HTTP requests
 */
export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Skip loading indicator for certain requests if needed
  const skipLoading = req.headers.get('skip-loading') === 'true';
  
  if (!skipLoading) {
    loadingService.setLoading(true);
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        loadingService.setLoading(false);
      }
    })
  );
};

