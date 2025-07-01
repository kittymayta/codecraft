import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit {
  question: any = null;
  loading = true;
  error = '';
  answers: any[] = [];
  comments: any[] = [];
  tags: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.http.get<any>(`http://localhost:8080/question/${id}`).subscribe({
      next: (res) => {
        this.question = res;
        this.answers = res.answers || [];
        this.comments = res.comments || [];
        this.tags = Array.from(res.tags || []);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar la pregunta';
        this.loading = false;
        console.error(err);
      }
    });
  }
}