import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {
  questions: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:8080/question').subscribe({
      next: (res) => {
        this.questions = res.content;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar preguntas';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
