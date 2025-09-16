import { ApiService, Post } from './../../services/api.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './post-details.html',
  styleUrl: './post-details.scss',
})
export class PostDetails implements OnInit, OnDestroy {
  post: Post | undefined;
  loading: boolean = true;
  error: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      console.log('ID do post:', id);

      if (id) {
        this.loadPost(id);
      } else {
        this.error = 'Post não encontrado';
        this.loading = false;
        this.router.navigate(['/']);
      }
    });
  }

  private loadPost(id: string): void {
    this.loading = true;
    this.error = '';

    this.apiService.getPostById(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
        // Atualiza visualizações
        if (this.post) {
          const newViews = (this.post.views || 0) + 1;
          this.apiService.updatePostViews(id, newViews).subscribe();
        }
      },
      error: (error) => this.handleError(error),
    });
  }

  private handleError(error: any): void {
    console.error('Erro ao carregar post:', error);
    this.error = 'Erro ao carregar a postagem';
    this.loading = false;
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/default-post.jpg';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  tryAgain(): void {
    if (this.post?.id) {
      this.loadPost(this.post.id.toString());
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
