import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginPayload   { username: string; password: string; }
interface RegisterPayload{ username: string; email: string; password: string; }
interface Question       { id: number; title: string; slug: string; content: string; tags: any[]; }
interface Answer         { id: number; content: string; /* ... */ }

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Autenticación
  login      (cred: LoginPayload): Observable<any> { return this.http.post(`${this.base}/auth/login`, cred); }
  register   (user: RegisterPayload): Observable<any> { return this.http.post(`${this.base}/auth/register`, user); }

  // Preguntas
  getQuestions(): Observable<Question[]> { return this.http.get<Question[]>(`${this.base}/questions`); }
  getQuestion (slug: string): Observable<Question> { return this.http.get<Question>(`${this.base}/questions/${slug}`); }
  postQuestion(data: any): Observable<any> { return this.http.post(`${this.base}/questions`, data); }

  // Respuestas
  postAnswer (questionId: number, ans: any): Observable<any> {
    return this.http.post(`${this.base}/questions/${questionId}/answers`, ans);
  }

  // Usuarios
  getProfile(): Observable<any> { return this.http.get(`${this.base}/users/me`); }
}
