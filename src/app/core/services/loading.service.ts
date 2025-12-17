import { Injectable, signal } from '@angular/core';

/**
 * Loading Service
 * Manages global loading state
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading = signal<boolean>(false);

  /**
   * Observable for loading state
   */
  isLoading = this._isLoading.asReadonly();

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  /**
   * Get current loading state
   */
  getLoading(): boolean {
    return this._isLoading();
  }
}

