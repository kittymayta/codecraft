// src/app/pages/inicio/inicio.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuestionsListComponent } from '../questions-list/questions-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, QuestionsListComponent],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {}
