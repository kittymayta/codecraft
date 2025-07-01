import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
  newAnswerContent: string = '';
  isSubmitting: boolean = false;
  submitError: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public auth: AuthService,
    public router: Router  // Cambiado de private a public
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

  submitAnswer(): void {
    if (!this.newAnswerContent.trim() || this.newAnswerContent.trim().length < 23) {
      this.submitError = 'La respuesta debe tener al menos 23 caracteres';
      return;
    }
  
    this.isSubmitting = true;
    this.submitError = '';
  
    const token = localStorage.getItem('token');
    const headers: { [header: string]: string } = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    this.http.post<any>(
      `http://localhost:8080/answer/${this.question.id}`,
      { content: this.newAnswerContent },
      { headers }
    ).subscribe({
      next: (res) => {
        const updatedAnswers = [res, ...this.answers];
        this.answers = updatedAnswers;
        this.question.answers = updatedAnswers;
        this.newAnswerContent = '';
        this.isSubmitting = false;
      },
      error: (err) => {
        // Manejo de errores...
      }
    });
  }
}