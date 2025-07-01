// src/app/services/tag.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Tag {
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class TagService {
  // Simulamos datos como si viniesen del backend
  private fakeTags: Tag[] = [
    { name: 'java',        description: 'Java programming' },
    { name: 'spring',      description: 'Spring Framework' },
    { name: 'postgresql',  description: 'PostgreSQL Database' },
    { name: 'angular',     description: 'Angular Framework' },
    { name: 'typescript',  description: 'TypeScript Language' }
  ];

  constructor() {}

  getTags(): Observable<Tag[]> {
    // Devolvemos el array envuelto en un Observable
    return of(this.fakeTags);
  }
}
