import { Injectable } from '@angular/core';
import { HttpClient }       from '@angular/common/http';
import { tap, Observable }  from 'rxjs';

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
          localStorage.setItem('token', res.token);
        })
      );
  }

  register(data: SignUpRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/sign-up`, data)
      .pipe(
        tap((res: AuthResponse) => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
