// src/app/pages/ask-question/ask-question.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TagService, Tag } from '../../services/tag.service';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-ask-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.scss']
})
export class AskQuestionComponent implements OnInit {
  form!: FormGroup;
  tags: Tag[] = [];
  isLoading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private tagService: TagService,
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title:        ['', [Validators.required, Validators.minLength(10)]],
      content:      ['', [Validators.required, Validators.minLength(23)]],
      selectedTags: ['']
    });

    // Carga simulada de tags
    this.tagService.getTags().subscribe({
      next: (data: Tag[]) => (this.tags = data),
      error: err => console.error('Error cargando tags', err)
    });
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    // Enviar como array, no como Set
  const dto = {
    title: this.form.value.title,
    content: this.form.value.content,
    tags: (this.form.value.selectedTags as string).split(',')
  };
  console.log('Enviando pregunta:', dto);

    this.isLoading = true;
    this.errorMsg = '';

    this.questionService.createQuestion(dto).subscribe({
      next: (res: any) => {
        console.log('Pregunta creada:', res);
        this.isLoading = false;
        this.router.navigate(['/questions']);
      },
      error: (err) => {
        console.error('Error completo:', err);
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Error al publicar la pregunta';
      }
    });
  }

  onTagToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    const current = this.form.value.selectedTags as string[];

    if (input.checked) {
      this.form.patchValue({ selectedTags: [...current, input.value] });
    } else {
      this.form.patchValue({
        selectedTags: current.filter(t => t !== input.value)
      });
    }
  }
}
