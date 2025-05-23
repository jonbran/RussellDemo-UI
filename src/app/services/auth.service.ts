import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthToken, User } from '../models/auth.model';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'access_token';
  private usernameKey = 'username';
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    const username = localStorage.getItem(this.usernameKey);
    
    if (token && username) {
      this.currentUserSubject.next({
        username,
        isAuthenticated: true
      });
    }
  }

  login(username: string, password: string): Observable<AuthToken> {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<AuthToken>(`${this.baseUrl}/auth/token`, formData.toString(), { headers })
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.access_token);
          localStorage.setItem(this.usernameKey, username);
          
          this.currentUserSubject.next({
            username,
            isAuthenticated: true
          });
        }),
        catchError(error => {
          this.errorService.handleError('Login failed', error);
          throw error;
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.getToken();
    return of(!!token);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
