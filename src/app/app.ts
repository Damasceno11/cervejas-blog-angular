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
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService, Category } from './services/api.service';
import { Subject, Observable, takeUntil } from 'rxjs';

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
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit, OnDestroy {
  title = 'Cervejas & Histórias';
  searchControl = new FormControl('');

  /**
   * Observable que emite a lista de categorias.
   * Ele é conectado diretamente ao observable do ApiService para se manter sempre atualizado.
   * A convenção '$' no final do nome indica que é um Observable.
   */
  categories$: Observable<Category[]>;

  /**
   * Um Subject usado para controlar o cancelamento de subscriptions quando o componente é destruído.
   * Esta é uma prática padrão para evitar vazamentos de memória (memory leaks).
   */
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Conectamos nossa variável local 'categories$' ao observable PÚBLICO do serviço.
    // Qualquer atualização emitida pelo serviço será refletida aqui automaticamente.
    this.categories$ = this.apiService.categories$;
  }

  ngOnInit(): void {
    // Ao iniciar o componente, pedimos ao serviço para buscar a lista de categorias na API.
    // O serviço irá buscar, armazenar e emitir a lista para todos os componentes que estiverem "ouvindo".
    this.apiService.refreshCategories().subscribe();

    // Fica "ouvindo" as mudanças nos parâmetros da URL (ex: ?search=termo).
    // Isso é útil para que o campo de busca reflita o estado da URL se o usuário
    // recarregar a página ou receber um link com um filtro já aplicado.
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const searchQuery = params['search'] || ''; // Usa 'search' para consistência
      if (searchQuery !== this.searchControl.value) {
        // Atualiza o valor do campo de busca sem disparar o evento 'valueChanges'.
        this.searchControl.setValue(searchQuery, { emitEvent: false });
      }
    });
  }

  ngOnDestroy(): void {
    // Quando o componente é destruído, este método é chamado.
    // Ele emite um valor no 'destroy$', fazendo com que todos os pipes 'takeUntil(this.destroy$)'
    // cancelem suas subscriptions, limpando a memória.
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Executa a busca ao pressionar Enter no input ou clicar no ícone de pesquisa.
   * Navega para a rota raiz, passando o termo de busca como um parâmetro na URL.
   */
  onSearch(): void {
    const query = (this.searchControl.value || '').trim();
    this.router.navigate(['/'], { queryParams: { search: query || null } });
  }

  /**
   * Filtra os posts pela categoria selecionada no menu.
   * Navega para a rota raiz, passando a categoria como um parâmetro na URL.
   */
  filterByCategory(categoryName: string): void {
    this.router.navigate(['/'], { queryParams: { category: categoryName || null } });
  }

  /**
   * Limpa apenas o campo de busca. Ativado pelo ícone 'X' no campo.
   */
  clearSearch(): void {
    this.searchControl.setValue('');
    this.onSearch(); // Re-executa a busca com o campo vazio para limpar o filtro de busca.
  }

  /**
   * Limpa TODOS os filtros (busca e categoria) e volta para a visualização inicial.
   * Ativado pelo clique no logo.
   */
  resetView(): void {
    this.searchControl.setValue('');
    this.router.navigate(['/']); // Navega para a raiz sem nenhum query param.
  }
}
