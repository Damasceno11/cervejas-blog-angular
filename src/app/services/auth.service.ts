import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isAuthenticated(): boolean {
    const user = localStorage.getItem('currentUser');
    return !!user; // Retorna true se houver um usuário logado
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }
}
