// src/app/services/quiestion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private apiUrl = 'http://localhost:8080/question';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createQuestion(body: any): Observable<any> {
    const token = this.authService.getToken();
    console.log('Service token:', token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}`, body, { headers });
  }
}