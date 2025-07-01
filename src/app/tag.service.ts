import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from './services/tag.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private readonly baseUrl = `http://localhost:8080/tag`;
  
  constructor(private http: HttpClient) { }

  create(tag: {name: string, description: string}): Observable<Tag>{
    return this.http.post<Tag>(`${this.baseUrl}`, tag);
  }

  getAll(): Observable<Tag[]>{
    return this.http.get<Tag[]>(this.baseUrl);
  }

}
