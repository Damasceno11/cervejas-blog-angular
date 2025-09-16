import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../../services/api.service';
import { Post } from '../../../services/api.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit {
  displayedColumns: string[] = ['title', 'views'];
  posts: Post[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.apiService.getPosts().subscribe((data) => {
      this.posts = data.sort((a, b) => (b.views || 0) - (a.views || 0)); // Ordena por visualizações
    });
  }
}
