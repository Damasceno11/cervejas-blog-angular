import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService, Category, Post } from '../../../../services/api.service';
import { Observable } from 'rxjs'; // CORREÇÃO: Importa o tipo 'Observable'.

@Component({
  selector: 'app-post-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './post-dialog.html',
  styleUrl: './post-dialog.scss',
})
export class PostDialog implements OnInit {
  postForm: FormGroup;
  isEditMode: boolean = false;
  categories$: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<PostDialog>,
    @Inject(MAT_DIALOG_DATA) public data?: Post
  ) {
    // Conecta a variável local ao observable público do serviço
    this.categories$ = this.apiService.categories$;
    this.isEditMode = !!data;

    this.postForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      author: [data?.author || '', Validators.required],
      category: [data?.category || '', Validators.required],
      content: [data?.content || '', Validators.required],
      imageUrl: [data?.imageUrl || ''],
    });
  }

  ngOnInit(): void {
    // Pede ao serviço para buscar/atualizar a lista de categorias da API.
    // O observable 'categories$' emitirá o valor para o template.
    this.apiService.refreshCategories().subscribe({
      error: (err) => console.error('Erro ao carregar categorias', err),
    });
  }

  onSave(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;

      if (this.isEditMode && this.data) {
        // CORREÇÃO: Simplificado. O método updatePost já aceita 'string | number'.
        this.apiService.updatePost(this.data.id, postData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Erro ao atualizar post:', error),
        });
      } else {
        // Data e views para um novo post
        const newPost = { ...postData, date: new Date().toISOString(), views: 0 };

        // CORREÇÃO: Passamos o objeto 'newPost' que contém a data e as views.
        this.apiService.createPost(newPost).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Erro ao criar post:', error),
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
