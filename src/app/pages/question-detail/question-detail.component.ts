import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  authorUsername: string = '';
  canVote: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public auth: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuestion();
  }

  loadQuestion(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(`http://localhost:8080/question/${id}`).subscribe({
      next: (res) => {
        this.question = res;
        this.answers = (res.answers || []).map((answer: any) => ({
          ...answer,
          is_correct: answer.is_correct ?? answer._correct ?? false
        }));
        this.comments = res.comments || [];
        this.tags = Array.from(res.tags || []);
        this.loading = false;

        console.log('Respuestas:', res.answers);

        this.authorUsername = res.user?.username || res.author?.username || '';
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 403) {
          this.error = 'Acceso denegado: debes iniciar sesión para ver esta pregunta';
          setTimeout(() => {
            this.router.navigate(['/login'], {
              queryParams: { returnUrl: this.router.url }
            });
          }, 3000);
        } else if (err.status === 404) {
          this.error = 'Pregunta no encontrada';
        } else {
          this.error = `Error ${err.status} al cargar la pregunta`;
        }
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
    if (token) headers['Authorization'] = `Bearer ${token}`;

    this.http.post<any>(
      `http://localhost:8080/answer/${this.question.id}`,
      { content: this.newAnswerContent },
      { headers }
    ).subscribe({
      next: (res) => {
        this.answers = [res, ...this.answers];
        this.newAnswerContent = '';
        this.isSubmitting = false;
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Error al enviar respuesta';
      }
    });
  }

  markAsCorrect(answerId: number): void {
    const token = localStorage.getItem('token');
    const headers: { [header: string]: string } = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
  
    this.http.post<any>(
      `http://localhost:8080/answer/solution/${answerId}`,
      {},
      { headers }
    ).subscribe({
      next: (updatedAnswer) => {
        console.log('Respuesta marcada como correcta:', updatedAnswer);
  
        // Marcar solo esta respuesta como correcta, desmarcando las demás
        this.answers = this.answers.map(ans => ({
          ...ans,
          is_correct: ans.id === updatedAnswer.id ? updatedAnswer.is_correct : false
        }));
        
        // Asegurar que se refleje correctamente en Angular
        const updated = this.answers.find(ans => ans.id === updatedAnswer.id);
        if (updated && updatedAnswer._correct !== undefined) {
          updated.is_correct = updatedAnswer._correct;
        }
  
        this.canVote = true;
      },
      error: (err) => {
        alert('Error al marcar respuesta como correcta');
      }
    });
  }

  vote(answerId: number, isUseful: boolean): void {
    const token = localStorage.getItem('token');
    const headers: { [header: string]: string } = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
  
    this.http.post<any>(
      `http://localhost:8080/answer/vote/${answerId}/${isUseful}`,
      {},
      { headers }
    ).subscribe({
      next: (updatedAnswer) => {
        // Busca la respuesta en el array y actualiza solo sus votos
        this.answers = this.answers.map(ans => {
          if (ans.id === updatedAnswer.id) {
            return {
              ...ans,
              upVotes: updatedAnswer.upVotes,
              downVotes: updatedAnswer.downVotes,
              score: updatedAnswer.score 
            };
          }
          return ans;
        });
      },
      error: (err) => {
        const msg = err?.error?.message || 'No tienes permiso para hacer esta acción o ya votaste.';
        alert(msg);
      }
    });
  }

  getMostVotedAnswerId(): number | null {
    if (!this.answers.length) return null;
    const top = [...this.answers].sort((a, b) => b.score - a.score)[0];
    return top ? top.id : null;
  }
}
