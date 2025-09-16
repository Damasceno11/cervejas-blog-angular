import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet, ActivatedRoute } from '@angular/router';
import { ApiService } from './services/api.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    ReactiveFormsModule,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  title = 'Cervejas & Histórias';
  categories: Category[] = [];
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('App Component inicializado');
    this.apiService.getCategories().subscribe((data) => {
      this.categories = data;
      console.log('Categorias carregadas:', data);
    });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      console.log('QueryParams mudaram:', params);
      const searchQuery = params['q'] || '';
      if (searchQuery !== this.searchControl.value) {
        console.log('Atualizando searchControl para:', searchQuery);
        this.searchControl.setValue(searchQuery, { emitEvent: false });
      }
    });

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        // CORREÇÃO: Removemos a navegação automática aqui
        // pois a busca só deve ser acionada com o botão ou 'Enter'
        // para evitar buscas desnecessárias
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    const query = (this.searchControl.value || '').trim();
    console.log('🔍 onSearch acionado, query digitada:', query);

    this.router.navigate(['/'], {
      queryParams: { q: query },
      queryParamsHandling: 'merge',
    });
  }

  filterByCategory(categoryName: string): void {
    const currentQuery = this.route.snapshot.queryParams['q'];

    console.log('Filtrando por categoria:', categoryName, 'Busca atual:', currentQuery);

    this.router.navigate(['/'], {
      queryParams: {
        category: categoryName || null,
        q: currentQuery || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  clearFilters(): void {
    console.log('Limpando filtros');
    this.searchControl.setValue('');

    const currentCategory = this.route.snapshot.queryParams['category'];

    this.router.navigate(['/'], {
      queryParams: {
        q: null,
        category: currentCategory || null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
