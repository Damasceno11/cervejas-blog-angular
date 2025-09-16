import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// Função validadora customizada para verificar se as senhas coincidem
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }
  return password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;
      this.apiService.register(username, password).subscribe({
        next: () => {
          this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro no cadastro:', error);
          this.snackBar.open('Erro ao cadastrar usuário. Tente outro username.', 'Fechar', {
            duration: 3000,
          });
        },
      });
    }
  }

  // Método para verificar erros específicos do formulário
  getUsernameErrors(): string {
    const usernameControl = this.registerForm.get('username');
    if (usernameControl?.hasError('required')) {
      return 'O username é obrigatório.';
    }
    if (usernameControl?.hasError('minlength')) {
      return 'O username deve ter no mínimo 3 caracteres.';
    }
    return '';
  }

  getPasswordErrors(): string {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'A senha é obrigatória.';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'A senha deve ter no mínimo 6 caracteres.';
    }
    return '';
  }
}
