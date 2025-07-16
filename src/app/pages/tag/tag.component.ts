// src/app/pages/tag/tag.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { TagService } from '../../services/tag.service';
import { Tag } from './Tag';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent implements OnInit {

  tags: Tag[] = [];
  tagForm!: FormGroup; // ✅ nombre más claro
  private formBuilder = inject(FormBuilder);

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.tagForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.loadTags();
  }

  loadTags(): void {
    this.tagService.getAll().subscribe({
      next: (data) => {
        this.tags = data;
      },
      error: (err) => {
        console.error('Error al cargar tags:', err);
      }
    });
  }

  createTag(): void {
    if (this.tagForm.invalid) return;

    const newTag = {
      name: this.tagForm.value.name,
      description: this.tagForm.value.description
    };

    this.tagService.create(newTag).subscribe({
      next: (data) => {
        console.log('Tag creado:', data);
        this.tagForm.reset();
        this.loadTags();
      },
      error: (err) => {
        console.error('Error al crear tag:', err);
        if (err.status === 409 && err.error?.message) {
          alert(`⚠️ ${err.error.message}`); // Puedes usar toast, snackbar, etc.
        }
      }
    });
  }}
