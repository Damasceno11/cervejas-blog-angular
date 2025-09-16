import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService, Category, Post } from '../../../../services/api.service';

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
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<PostDialog>,
    @Inject(MAT_DIALOG_DATA) public data?: Post
  ) {
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
    this.apiService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  onSave(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;

      if (this.isEditMode && this.data) {
        if (typeof this.data.id === 'number') {
          this.apiService.updatePost(this.data.id, postData).subscribe({
            next: () => this.dialogRef.close(true), // Fecha o dialog com sucesso
            error: (error) => console.error('Erro ao atualizar post:', error),
          });
        } else {
          this.apiService.updatePost(this.data.id, postData).subscribe({
            next: () => this.dialogRef.close(true), // Fecha o dialog com sucesso
            error: (error) => console.error('Erro ao atualizar post:', error),
          });
        }
      } else {
        // Data e views novo post
        const newPost = { ...postData, date: new Date().toISOString(), views: 0 };
        this.apiService.createPost(postData).subscribe({
          next: () => this.dialogRef.close(true), // Fecha o dialog com sucesso
          error: (error) => console.error('Erro ao criar post:', error),
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
