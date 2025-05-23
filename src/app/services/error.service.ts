import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor() { }

  handleError(operation: string, error: any): void {
    let errorMessage = '';

    if (error instanceof HttpErrorResponse) {
      // The backend returned an unsuccessful response code
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // The backend returned an unsuccessful response code
        // The response body may contain clues as to what went wrong
        const apiError = error.error as ApiError;
        errorMessage = apiError?.detail || `Server returned code ${error.status}, message was: ${error.message}`;
      }
    } else {
      // A client-side or network error occurred
      errorMessage = error.message || error.toString();
    }

    // Log the error
    console.error(`${operation} failed: ${errorMessage}`);
    
    // You can add more error handling here, like showing a toast notification
  }
}
