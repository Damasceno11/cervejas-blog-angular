import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService, Category } from '../../../../services/api.service';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './category-dialog.html',
  styleUrl: './category-dialog.scss',
})
export class CategoryDialog {
  categoryForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<CategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data?: Category
  ) {
    this.isEditMode = !!data;
    this.categoryForm = this.fb.group({
      name: [data?.name || '', Validators.required],
    });
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      if (this.data) {
        this.apiService.updateCategory(this.data.id, categoryData).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.apiService.createCategory(categoryData).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
