import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorService } from './error.service';
import { HealthCheckResponse } from '../models/api.model';
import { ProviderResponse } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  // Generic GET method
  get<T>(endpoint: string, options?: {
    headers?: HttpHeaders,
    params?: HttpParams
  }): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options)
      .pipe(
        catchError(error => {
          this.errorService.handleError(`GET ${endpoint}`, error);
          throw error;
        })
      );
  }

  // Generic POST method
  post<T>(endpoint: string, body: any, options?: {
    headers?: HttpHeaders,
    params?: HttpParams
  }): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, options)
      .pipe(
        catchError(error => {
          this.errorService.handleError(`POST ${endpoint}`, error);
          throw error;
        })
      );
  }

  // Generic PUT method
  put<T>(endpoint: string, body: any, options?: {
    headers?: HttpHeaders,
    params?: HttpParams
  }): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, options)
      .pipe(
        catchError(error => {
          this.errorService.handleError(`PUT ${endpoint}`, error);
          throw error;
        })
      );
  }

  // Generic DELETE method
  delete<T>(endpoint: string, options?: {
    headers?: HttpHeaders,
    params?: HttpParams
  }): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, options)
      .pipe(
        catchError(error => {
          this.errorService.handleError(`DELETE ${endpoint}`, error);
          throw error;
        })
      );
  }

  // Health check
  checkHealth(): Observable<HealthCheckResponse> {
    return this.get<HealthCheckResponse>('/health');
  }

  // Get available providers and default provider
  getProviders(): Observable<ProviderResponse> {
    return this.get<ProviderResponse>('/api/models');
  }
}
