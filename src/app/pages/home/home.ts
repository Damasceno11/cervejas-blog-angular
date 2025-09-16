import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService, Category, Post } from '../../services/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

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
  posts: Post[] = [];
  categories: Category[] = [];
  private destroy$ = new Subject<void>();
  loading: boolean = false;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('Home inicializado');
    this.loadCategories();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      console.log('Parâmetros da URL mudaram:', params);
      const category = params['category'];
      const query = params['q'];
      this.loadPosts(category, query);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    this.apiService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.categories = data;
          console.log('Categorias carregadas: ', this.categories);
        },
        error: (error) => {
          console.error('Erro ao carregar categorias', error);
        },
      });
  }

  loadPosts(category?: string, query?: string): void {
    console.log('Carregando posts. Categoria:', category, 'Query:', query);
    this.loading = true;
    this.apiService
      .getPosts(category, query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('Posts recebidos:', data.length, 'posts');
          this.posts = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar posts:', error);
          this.loading = false;
        },
      });
  }
}
