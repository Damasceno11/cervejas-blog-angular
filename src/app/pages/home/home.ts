import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService, Category, Post } from '../../services/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  posts$: Observable<Post[]>;
  categories$: Observable<Category[]>;
  private destroy$ = new Subject<void>();
  loading: boolean = false;

  // Variáveis para o estado atual dos filtros
  currentCategory = '';
  currentSearch = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    // 2. Conectamos as nossas variáveis locais aos observables PÚBLICOS do serviço.
    this.categories$ = this.apiService.categories$;

    // 3. A lógica para buscar os posts agora também é reativa.
    // Ela "ouve" as mudanças nos parâmetros da URL e busca os posts correspondentes.
    this.posts$ = this.route.queryParams.pipe(
      switchMap((params) => {
        this.currentCategory = params['category'] || '';
        this.currentSearch = params['search'] || '';
        return this.apiService.getPosts(this.currentCategory, this.currentSearch);
      })
    );
  }

  ngOnInit(): void {
    this.apiService.refreshCategories().subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
