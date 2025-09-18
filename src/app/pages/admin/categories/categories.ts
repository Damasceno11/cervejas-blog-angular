import { Observable } from 'rxjs';
import { CategoryDialog } from './category-dialog/category-dialog';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService, Category } from '../../../services/api.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  displayedColumns: string[] = ['name', 'actions'];
  categories$: Observable<Category[]>;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.categories$ = this.apiService.categories$;
  }

  ngOnInit(): void {
    this.apiService.refreshCategories().subscribe();
  }

  openCategoryDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryDialog, {
      width: '400px',
      data: category,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Categoria salva com sucesso!', 'Fechar', { duration: 3000 });
      }
    });
  }

  deleteCategory(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Tem certeza que deseja excluir esta categoria?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.deleteCategory(id).subscribe(() => {
          this.snackBar.open('Categoria excluída!', 'Fechar', { duration: 3000 });
        });
      }
    });
  }
}
