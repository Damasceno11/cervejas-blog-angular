import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, MatTabsModule, MatButtonModule, MatToolbarModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  selectedTabIndex = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Sincroniza a tab selecionada com a rota atual
    this.updateSelectedTabBasedOnRoute();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    this.navigateToTab(index);
  }

  private navigateToTab(index: number): void {
    const routes = ['posts', 'categories', 'stats'];
    if (routes[index]) {
      this.router.navigate(['/admin', routes[index]]);
    }
  }

  private updateSelectedTabBasedOnRoute(): void {
    const currentRoute = this.router.url;
    const routes = ['posts', 'categories', 'stats'];

    routes.forEach((route, index) => {
      if (currentRoute.includes(route)) {
        this.selectedTabIndex = index;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
