import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,        // NgIf, NgFor...
    ReactiveFormsModule, // formGroup, formControlName
    RouterModule         // routerLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  errorMsg = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.errorMsg = '';

    const body = {
      username: this.form.value.username,
      password: this.form.value.password,
      authCreateRoleRequest: { roles: ['USER'] }
    };

    this.auth.register(body).subscribe({
      next: res => {
        this.isLoading = false;
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']);
      },
      error: err => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Error al registrar';
      }
    });
  }
}

