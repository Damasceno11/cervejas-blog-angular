import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService, Post, Category } from '../../../services/api.service';
import { PostDialog } from './post-dialog/post-dialog';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './posts.html',
  styleUrl: './posts.scss',
})
export class Posts implements OnInit {
  displayedColumns: string[] = ['title', 'author', 'category', 'views', 'actions'];
  posts: Post[] = [];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.apiService.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  openPostDialog(post?: Post): void {
    const dialogRef = this.dialog.open(PostDialog, {
      width: '600px',
      data: post,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPosts();
        this.snackBar.open('Postagem salva com sucesso!', 'Fechar', { duration: 3000 });
      }
    });
  }

  deletePost(id: string | number): void {
    if (confirm('Tem certeza que deseja excluir esta postagem?')) {
      if (typeof id === 'number') {
        this.apiService.deletePost(id).subscribe(() => {
          this.loadPosts();
          this.snackBar.open('Postagem excluída!', 'Fechar', { duration: 3000 });
        });
      } else {
        this.apiService.deletePost(id).subscribe(() => {
          this.loadPosts();
          this.snackBar.open('Postagem excluída!', 'Fechar', { duration: 3000 });
        });
      }
    }
  }
}
