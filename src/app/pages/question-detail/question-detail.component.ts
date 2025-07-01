import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
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
        // Crear un nuevo array de respuestas con la nueva respuesta primero
        const updatedAnswers = [res, ...this.answers];
        
        // Actualizar ambas propiedades
        this.answers = updatedAnswers;
        this.question.answers = updatedAnswers;
        
        this.newAnswerContent = '';
        this.isSubmitting = false;
      },
      error: (err) => {
        if (err.status === 409) {
          this.submitError = 'No puedes responder dos veces a la misma pregunta';
        } else if (err.status === 401) {
          this.submitError = 'Debes iniciar sesión para responder';
        } else if (err.status === 400) {
          this.submitError = 'Respuesta inválida: ' + (err.error?.message || '');
        } else {
          this.submitError = 'Error al enviar la respuesta';
        }
        this.isSubmitting = false;
        console.error('Detalles del error:', err);
      }
    });
  }
}