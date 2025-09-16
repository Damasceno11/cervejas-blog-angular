import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category, ApiService } from '../services/api.service';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './search-filter.html',
  styleUrl: './search-filter.scss',
})
export class SearchFilter implements OnInit, OnDestroy {
  searchForm: FormGroup;
  categories: Category[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      category: [''],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.searchForm.patchValue({
        query: params['q'] || '',
        category: params['category'] || '',
      });
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
        next: (data) => (this.categories = data),
        error: (error) => console.error('Erro ao carregar categorias:', error),
      });
  }

  search(): void {
    const query = this.searchForm.value.query;
    const category = this.searchForm.value.category;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: query || null, category: category || null },
      queryParamsHandling: 'merge',
    });
  }
}
