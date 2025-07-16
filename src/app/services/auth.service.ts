// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, Observable } from 'rxjs';

export interface AuthResponse {
  username: string;
  message: string;
  token: string;
  status: boolean;
}

export interface SignUpRequest {
  username: string;
  password: string;
  authCreateRoleRequest: { roles: string[] };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/log-in`, credentials)
      .pipe(
        tap((res: AuthResponse) => {
          if (res.token) {
            localStorage.setItem('token', res.token);
          }
        })
      );
  }

  register(data: SignUpRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/sign-up`, data)
      .pipe(
        tap((res: AuthResponse) => {
          if (res.token) {
            localStorage.setItem('token', res.token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.reload(); // Forzar recarga para limpiar estado
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return null;
    }
  }
  
}