import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

export interface Post {
  id: string | number;
  title: string;
  author: string;
  category: string;
  content: string;
  date: string;
  views: number;
  imageUrl?: string;
}

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://cervejas-api-fu2o.onrender.com';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      if (error.status === 404) {
        errorMessage = `Recurso não encontrado (404)`;
      } else {
        errorMessage = `Código do erro: ${error.status}, mensagem: ${error.message}`;
      }
    }
    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  getPosts(category?: string, query?: string): Observable<Post[]> {
    let params = new HttpParams().set('_sort', 'date').set('_order', 'desc');

    // Removemos o filtro de categoria da URL e passamos a usar o filtro no frontend
    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { params }).pipe(
      map((posts) => {
        let filteredPosts = posts;

        // Filtra por categoria no frontend
        if (category) {
          filteredPosts = filteredPosts.filter((post) => post.category === category);
        }

        // Filtra por termo de busca no frontend
        if (query) {
          const lower = query
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

          filteredPosts = filteredPosts.filter((post) =>
            post.title
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .includes(lower)
          );
        }
        return filteredPosts;
      }),
      catchError(this.handleError)
    );
  }

  // Mantemos o método getFilteredPosts como estava, já que a busca no frontend é feita pelo getPosts agora
  getFilteredPosts(searchTerm: string = '', category: string = ''): Observable<Post[]> {
    let params = new HttpParams();
    params = params.set('_sort', 'date');
    params = params.set('_order', 'desc');

    if (searchTerm) {
      params = params.set('title_like', searchTerm);
    }
    if (category) {
      params = params.set('category', category);
    }

    return this.http
      .get<Post[]>(`${this.apiUrl}/posts`, { params })
      .pipe(catchError(this.handleError));
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this.apiUrl}/categories`)
      .pipe(catchError(this.handleError));
  }

  login(username: string, password: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users?username=${username}&password=${password}`)
      .pipe(catchError(this.handleError));
  }

  createPost(post: Omit<Post, 'id' | 'date' | 'views'>): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post).pipe(catchError(this.handleError));
  }

  updatePost(id: string | number, post: Partial<Post>): Observable<Post> {
    return this.http
      .patch<Post>(`${this.apiUrl}/posts/${id}`, post)
      .pipe(catchError(this.handleError));
  }

  deletePost(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/posts/${id}`).pipe(catchError(this.handleError));
  }

  updatePostViews(id: string | number, views: number): Observable<any> {
    return this.http
      .patch<any>(`${this.apiUrl}/posts/${id}`, { views })
      .pipe(catchError(this.handleError));
  }

  getPostById(id: string | number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`).pipe(catchError(this.handleError));
  }

  register(username: string, password: string): Observable<any> {
    const newUser = { username, password };
    return this.http.post<any>(`${this.apiUrl}/users`, newUser).pipe(catchError(this.handleError));
  }

  createCategory(category: { name: string }): Observable<Category> {
    return this.http
      .post<Category>(`${this.apiUrl}/categories`, category)
      .pipe(catchError(this.handleError));
  }

  updateCategory(id: number, category: { name: string }): Observable<Category> {
    return this.http
      .patch<Category>(`${this.apiUrl}/categories/${id}`, category)
      .pipe(catchError(this.handleError));
  }

  deleteCategory(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/categories/${id}`)
      .pipe(catchError(this.handleError));
  }
}
