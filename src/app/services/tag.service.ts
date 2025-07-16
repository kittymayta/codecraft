// src/app/services/tag.service.ts
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from '../pages/tag/Tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private readonly baseUrl = `http://localhost:8080/tag`;
  
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Crea un nuevo tag
  create(tag: { name: string; description: string }): Observable<Tag> {
    return this.http.post<Tag>(`${this.baseUrl}`, tag, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtiene todos los tags disponibles
  getAll(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders()
    });
  }
}
