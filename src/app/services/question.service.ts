import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private apiUrl = 'http://localhost:8080/question';

  constructor(private http: HttpClient) {}

  createQuestion(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, body);
  }
}
