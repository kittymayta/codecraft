import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuestionsListComponent } from '../questions-list/questions-list.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Añade AuthService
import { Router } from '@angular/router'; // Añade Router

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, QuestionsListComponent],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    // Si la ruta está protegida y el usuario no está autenticado
    if (!this.auth.isLoggedIn()) {
      // Redirigir a login con returnUrl
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
    }
  }
}